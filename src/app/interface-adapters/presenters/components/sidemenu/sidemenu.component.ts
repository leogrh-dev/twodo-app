import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { AuthService } from '../../../../core/services/auth.service';
import { NoteService } from '../../../../core/services/note.service';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';

interface UserInfo {
  name: string;
  email: string;
  initial: string;
}

interface NoteItem {
  id: string;
  title: string;
}

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss',
  imports: [
    CommonModule,
    NzToolTipModule,
    NzDropDownModule,
    ThemeSwitcherComponent,
  ],
})
export class SidemenuComponent implements OnInit {
  private static readonly MAX_NOTES_DISPLAY = 10;
  private static readonly DEFAULT_USER_NAME = 'Usuário';
  private static readonly DEFAULT_USER_INITIAL = 'U';
  private static readonly NEW_NOTE_TITLE = 'Nova página';

  @Input() isCollapsed: boolean = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  userInfo: UserInfo = {
    name: SidemenuComponent.DEFAULT_USER_NAME,
    email: '',
    initial: SidemenuComponent.DEFAULT_USER_INITIAL,
  };

  userNotes: NoteItem[] = [];

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly noteService: NoteService,
    private readonly router: Router,
  ) {
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
          this.navigateToNote(note.id);
        }
      });
  }

  navigateToNote(noteId: string): void {
    this.router.navigateByUrl(`/note/${noteId}`);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  goToHomepage(): void {
    this.router.navigateByUrl('/');
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

  private loadUserNotes(): void {
    this.noteService.getUserNotes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(notes => {
        this.userNotes = this.processNotes(notes);
      });
  }

  private processNotes(notes: NoteItem[]): NoteItem[] {
    return notes
      .slice(0, SidemenuComponent.MAX_NOTES_DISPLAY)
      .map(note => ({
        ...note,
        title: note.title || SidemenuComponent.NEW_NOTE_TITLE,
      }));
  }

  get userName(): string {
    return this.userInfo.name;
  }

  get userInitial(): string {
    return this.userInfo.initial;
  }
}