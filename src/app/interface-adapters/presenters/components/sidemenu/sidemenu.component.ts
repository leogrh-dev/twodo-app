import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  DestroyRef,
  inject,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { AuthService } from '../../../../core/services/auth.service';
import { NoteService } from '../../../../core/services/note.service';
import { NoteStateService } from '../../../../core/services/note-state.service';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { TrashModalComponent } from '../trash-modal/trash-modal.component';
import { AllGroupNotesModalComponent } from '../all-group-notes-modal/all-group-notes-modal.component';
import { Note } from '../../../../core/entities/note.entity';
import { SearchModalComponent } from '../search-modal/search-modal.component';
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';
import { UserStateService } from '../../../../core/services/user-state.service';

interface UserInfo {
  name: string;
  email: string;
  initial: string;
}

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    NzDropDownModule,
    NzInputModule,
    NzToolTipModule,
    ThemeSwitcherComponent,
    TrashModalComponent,
    AllGroupNotesModalComponent,
    SearchModalComponent,
    SettingsModalComponent
  ],
})
export class SidemenuComponent implements OnInit {
  private static readonly DEFAULT_USER_NAME = 'Usuário';
  private static readonly DEFAULT_USER_INITIAL = 'U';
  private static readonly NEW_NOTE_TITLE = 'Nova página';

  // Inputs / Outputs
  @Input() isCollapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  // Injeções
  private readonly authService = inject(AuthService);
  private readonly noteService = inject(NoteService);
  private readonly noteStateService = inject(NoteStateService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // Sinais e estado interno
  readonly currentUrl = signal(this.router.url);
  readonly showTrashModal = signal(false);
  readonly showSearchModal = signal(false);
  readonly showSettingsModal = signal(false);
  readonly modalState = signal<'user' | 'favorites' | null>(null);
  readonly allUserNotes = signal<Note[]>([]);
  readonly allFavoriteNotes = signal<Note[]>([]);
  draftTitle = '';

  // Observables
  readonly userNotes$ = this.noteStateService.userNotes$;
  readonly favoriteNotes$ = this.noteStateService.favoriteNotes$;
  readonly visibleUserNotes$ = this.userNotes$.pipe(map(n => n.slice(0, 10)));
  readonly visibleFavoriteNotes$ = this.favoriteNotes$.pipe(map(n => n.slice(0, 10)));

  // Usuário logado
  private readonly userState = inject(UserStateService);

  // Ciclo de vida
  ngOnInit(): void {
    this.loadUserNotes();

    this.router.events.subscribe(() => {
      this.currentUrl.set(this.router.url);
    });
  }

  // Ações principais
  createNewNote(): void {
    this.noteService.createNote()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(note => {
        if (!note?.id) return;

        const noteEntity = this.createNoteEntity(note.id);
        this.noteStateService.addUserNote(noteEntity);

        const updatedNotes = [noteEntity, ...this.allUserNotes()];
        this.allUserNotes.set(updatedNotes);

        if (noteEntity.isFavorite) {
          this.allFavoriteNotes.set([noteEntity, ...this.allFavoriteNotes()]);
        }

        this.navigateToNote(note.id);
      });
  }

  softDeleteNote(noteId: string): void {
    this.noteService.softDeleteNote(noteId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.noteStateService.moveNoteToTrash(noteId);
        if (this.router.url === `/note/${noteId}`) {
          this.router.navigateByUrl('/');
        }
      });
  }

  toggleFavoriteNote(noteId: string): void {
    this.noteStateService.toggleFavoriteNote(noteId);
  }

  onTitleInputChange(newTitle: string): void {
    const trimmed = newTitle.trim();
    if (trimmed.length > 0) {
      this.noteStateService.updateTitle(trimmed);
    }
  }

  // Navegação
  navigateToNote(noteId: string): void {
    this.router.navigateByUrl(`/note/${noteId}`);
  }

  goToHomepage(): void {
    this.router.navigateByUrl('/');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  // Modais
  toggleTrashModal(): void {
    this.showTrashModal.update(v => !v);
  }

  toggleSearchModal(): void {
    this.showSearchModal.update(v => !v);
  }

  toggleSettingsModal(): void {
    this.showSettingsModal.update(v => !v);
  }

  openAllNotes(group: 'user' | 'favorites'): void {
    this.modalState.set(group);

    this.userNotes$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(userNotes => {
        if (group === 'user') {
          this.allUserNotes.set(userNotes);
        } else {
          this.allFavoriteNotes.set(userNotes.filter(note => note.isFavorite));
        }
      });
  }

  // Utilitários de rota
  isNoteActive(noteId: string): boolean {
    return this.currentUrl().startsWith(`/note/${noteId}`);
  }

  isHomepageActive(): boolean {
    return this.currentUrl() === '/';
  }

  // View helpers
  deletedNotesCount(): number {
    return this.noteStateService.getDeletedNotesCount();
  }

  get userName(): string {
    return this.userState.userName();
  }

  get userInitial(): string {
    return this.userState.userInitial();
  }

  get iconUrl(): string | null {
    return this.userState.iconUrl();
  }

  get selectedGroupType(): 'user' | 'favorites' {
    return this.modalState() ?? 'user';
  }

  get groupTitle(): string {
    switch (this.modalState()) {
      case 'favorites': return 'Favoritos';
      case 'user': return 'Anotações';
      default: return '';
    }
  }

  // Inicializações privadas
  private loadUserNotes(): void {
    this.noteService.getUserNotes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(notes => {
        const entities = notes.map(n => this.noteService.createNoteEntity(n));
        this.noteStateService.setUserNotes(entities);
        this.allUserNotes.set(entities);
        this.allFavoriteNotes.set(entities.filter(n => n.isFavorite));
      });
  }

  private extractUserInitial(name?: string): string {
    return name?.charAt(0).toUpperCase() ?? SidemenuComponent.DEFAULT_USER_INITIAL;
  }

  private createNoteEntity(noteId: string): Note {
    const user = this.userState.user();
    const ownerId = user?.id ?? '';

    return this.noteService.createNoteEntity({
      id: noteId,
      title: SidemenuComponent.NEW_NOTE_TITLE,
      content: '',
      bannerUrl: null,
      ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}