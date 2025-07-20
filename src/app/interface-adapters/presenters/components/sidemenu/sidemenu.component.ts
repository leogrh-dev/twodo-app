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
    TrashModalComponent,
    AllGroupNotesModalComponent,
    SearchModalComponent,
    SettingsModalComponent,
    ThemeSwitcherComponent,
  ],
})
export class SidemenuComponent implements OnInit {
  // ==============================
  // Constantes
  // ==============================

  private static readonly NEW_NOTE_TITLE = 'Nova página';

  // ==============================
  // Injeções
  // ==============================

  private readonly authService = inject(AuthService);
  private readonly noteService = inject(NoteService);
  private readonly noteStateService = inject(NoteStateService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly userState = inject(UserStateService);

  // ==============================
  // Inputs e Outputs
  // ==============================

  @Input() isCollapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  // ==============================
  // Sinais reativos
  // ==============================

  readonly currentUrl = signal(this.router.url);
  readonly showTrashModal = signal(false);
  readonly showSearchModal = signal(false);
  readonly showSettingsModal = signal(false);
  readonly modalState = signal<'user' | 'favorites' | null>(null);
  readonly allUserNotes = signal<Note[]>([]);
  readonly allFavoriteNotes = signal<Note[]>([]);

  /** Título digitado no campo de nova nota */
  draftTitle = '';

  // ==============================
  // Observables
  // ==============================

  readonly userNotes$ = this.noteStateService.userNotes$;
  readonly favoriteNotes$ = this.noteStateService.favoriteNotes$;
  readonly visibleUserNotes$ = this.userNotes$.pipe(map(n => n.slice(0, 10)));
  readonly visibleFavoriteNotes$ = this.favoriteNotes$.pipe(map(n => n.slice(0, 10)));

  // ==============================
  // Lifecycle
  // ==============================

  ngOnInit(): void {
    this.loadUserNotes();
    this.router.events.subscribe(() => {
      this.currentUrl.set(this.router.url);
    });
  }

  // ==============================
  // Ações de nota
  // ==============================

  /** Cria uma nova nota e redireciona para a página */
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

  /** Deleta (soft delete) uma nota e redireciona para a home se necessário */
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

  /** Alterna o status de favorito de uma nota */
  toggleFavoriteNote(noteId: string): void {
    this.noteStateService.toggleFavoriteNote(noteId);
  }

  /** Atualiza o título da nota atual */
  onTitleInputChange(newTitle: string): void {
    const trimmed = newTitle.trim();
    if (trimmed.length > 0) {
      this.noteStateService.updateTitle(trimmed);
    }
  }

  // ==============================
  // Navegação
  // ==============================

  /** Navega para uma nota específica */
  navigateToNote(noteId: string): void {
    this.router.navigateByUrl(`/note/${noteId}`);
  }

  /** Vai para a página inicial */
  goToHomepage(): void {
    this.router.navigateByUrl('/');
  }

  /** Faz logout e volta para o login */
  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  // ==============================
  // Modais
  // ==============================

  /** Abre/fecha o modal da lixeira */
  toggleTrashModal(): void {
    this.showTrashModal.update(v => !v);
  }

  /** Abre/fecha o modal de busca */
  toggleSearchModal(): void {
    this.showSearchModal.update(v => !v);
  }

  /** Abre/fecha o modal de configurações */
  toggleSettingsModal(): void {
    this.showSettingsModal.update(v => !v);
  }

  /** Abre todas as notas de um grupo (favoritos ou usuais) */
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

  // ==============================
  // Getters auxiliares
  // ==============================

  /** Verifica se uma nota está ativa (rota atual) */
  isNoteActive(noteId: string): boolean {
    return this.currentUrl().startsWith(`/note/${noteId}`);
  }

  /** Verifica se está na homepage */
  isHomepageActive(): boolean {
    return this.currentUrl() === '/';
  }

  /** Quantidade de notas na lixeira */
  deletedNotesCount(): number {
    return this.noteStateService.getDeletedNotesCount();
  }

  /** Nome do usuário atual */
  get userName(): string {
    return this.userState.name();
  }

  /** Primeira letra do nome do usuário */
  get userInitial(): string {
    return this.userState.initial();
  }

  /** URL do ícone de perfil do usuário */
  get iconUrl(): string | null {
    return this.userState.iconUrl();
  }

  /** Tipo de grupo atualmente selecionado */
  get selectedGroupType(): 'user' | 'favorites' {
    return this.modalState() ?? 'user';
  }

  /** Título do grupo atualmente selecionado */
  get groupTitle(): string {
    switch (this.modalState()) {
      case 'favorites': return 'Favoritos';
      case 'user': return 'Anotações';
      default: return '';
    }
  }

  // ==============================
  // Métodos privados
  // ==============================

  /** Carrega todas as notas do usuário */
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

  /** Cria uma instância da nota padrão */
  private createNoteEntity(noteId: string): Note {
    const ownerId = this.userState.user$()?.id ?? '';

    return this.noteService.createNoteEntity({
      id: noteId,
      title: SidemenuComponent.NEW_NOTE_TITLE,
      content: '',
      bannerUrl: null,
      iconUrl: null,
      ownerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
      isFavorite: false,
    });
  }

  // ==============================
  // Eventos da UI
  // ==============================

  /** Impede propagação do clique no ícone de opções da nota */
  onNoteOptionsClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}