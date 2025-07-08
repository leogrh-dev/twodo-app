import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { AuthService } from '../../../../core/services/auth.service';
import { NoteService } from '../../../../core/services/note.service';
import { NoteStateService } from '../../../../core/services/note-state.service';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { TrashModalComponent } from '../trash-modal/trash-modal.component';

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
  ],
})
export class SidemenuComponent implements OnInit {
  private static readonly MAX_NOTES_DISPLAY = 10;
  private static readonly DEFAULT_USER_NAME = 'Usuário';
  private static readonly DEFAULT_USER_INITIAL = 'U';
  private static readonly NEW_NOTE_TITLE = 'Nova página';

  @Input() isCollapsed: boolean = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  private readonly authService = inject(AuthService);
  private readonly noteService = inject(NoteService);
  private readonly noteStateService = inject(NoteStateService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly userNotes$ = this.noteStateService.userNotes$;

  showTrashModal = signal(false);

  draftTitle = '';
  userInfo: UserInfo = {
    name: SidemenuComponent.DEFAULT_USER_NAME,
    email: '',
    initial: SidemenuComponent.DEFAULT_USER_INITIAL,
  };

  constructor() {
    this.initializeUserInfo();
  }

  ngOnInit(): void {
    this.loadUserNotes();
  }

  createNewNote(): void {
    this.noteService.createNote()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(note => {
        if (note?.id) {
          const noteEntity = this.createNoteEntity(note.id);
          this.noteStateService.addUserNote(noteEntity);
          this.navigateToNote(note.id);
        }
      });
  }

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

  toggleTrashModal(): void {
    this.showTrashModal.update(value => !value);
  }

  softDeleteNote(noteId: string): void {
    this.noteService.softDeleteNote(noteId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.noteStateService.moveNoteToTrash(noteId);
        this.handleNoteDeletedNavigation(noteId);
      });
  }

  onTitleInputChange(newTitle: string): void {
    const cleanTitle = newTitle.trim();
    if (cleanTitle.length > 0) {
      this.noteStateService.updateTitle(cleanTitle);
    }
  }

  deletedNotesCount(): number {
    return this.noteStateService.getDeletedNotesCount();
  }

  get userName(): string {
    return this.userInfo.name;
  }

  get userInitial(): string {
    return this.userInfo.initial;
  }

  private loadUserNotes(): void {
    this.noteService.getUserNotes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(notes => {
        const noteEntities = notes.map(note => this.noteService.createNoteEntity(note));
        this.noteStateService.setUserNotes(noteEntities);
      });
  }

  private initializeUserInfo(): void {
    const user = this.authService.getCurrentUser();
    this.userInfo = {
      name: user?.name ?? SidemenuComponent.DEFAULT_USER_NAME,
      email: user?.email ?? '',
      initial: this.extractUserInitial(user?.name),
    };
  }

  private extractUserInitial(name: string | undefined): string {
    return name?.charAt(0).toUpperCase() ?? SidemenuComponent.DEFAULT_USER_INITIAL;
  }

  private createNoteEntity(noteId: string) {
    return this.noteService.createNoteEntity({
      id: noteId,
      title: SidemenuComponent.NEW_NOTE_TITLE,
      content: '',
      bannerUrl: null,
      ownerId: this.authService.getCurrentUser()?.userId ?? '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  private handleNoteDeletedNavigation(noteId: string): void {
    const currentUrl = this.router.url;
    const isViewingDeletedNote = currentUrl === `/note/${noteId}`;

    if (isViewingDeletedNote) {
      this.router.navigateByUrl('/');
    }
  }
}