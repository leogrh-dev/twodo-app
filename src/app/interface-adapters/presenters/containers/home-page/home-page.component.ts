import { Component, DestroyRef, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CommonModule } from '@angular/common';
import { RecentNotesComponent } from '../../components/recent-notes/recent-notes.component';

import { ThemeService } from '../../../../core/services/theme.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NoteService } from '../../../../core/services/note.service';
import { NoteStateService } from '../../../../core/services/note-state.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  imports: [CommonModule, RecentNotesComponent],
})
export class HomePageComponent {
  // ==============================
  // Estado da interface
  // ==============================

  /** Caminho do logo atual com base no tema */
  logoPath: string = 'assets/images/twodo-logos/twodo-logo.svg';

  /** Nome do usuário atual */
  userName: string = 'Usuário';

  /** Indica se o usuário tem notas */
  hasNotes: boolean = false;

  // ==============================
  // Subscriptions e injeções
  // ==============================

  private readonly destroyRef = inject(DestroyRef);
  private readonly noteState = inject(NoteStateService);

  // ==============================
  // Construtor
  // ==============================

  constructor(
    private readonly themeService: ThemeService,
    private readonly authService: AuthService,
    private readonly noteService: NoteService,
  ) {
    this.loadUserInfo();
    this.loadUserNotes();
    this.watchTheme();
  }

  // ==============================
  // Lógica de carregamento
  // ==============================

  /** Carrega o nome do usuário autenticado */
  private loadUserInfo(): void {
    this.authService.getCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.userName = user?.name ?? 'Usuário';
      });
  }

  /** Carrega e popula as notas do usuário */
  private loadUserNotes(): void {
    this.noteService.getUserNotes().subscribe(notes => {
      const entities = notes.map(n => this.noteService.createNoteEntity(n));
      this.noteState.setUserNotes(entities);
      this.hasNotes = true;
    });
  }

  /** Observa o tema atual e atualiza o logo */
  private watchTheme(): void {
    this.themeService.theme$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(theme => {
        this.logoPath = theme.mode === 'dark'
          ? 'assets/images/twodo-logos/twodo-dark-logo.svg'
          : 'assets/images/twodo-logos/twodo-logo.svg';
      });
  }
}