import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ThemeService } from '../../../../core/services/theme.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NoteStateService } from '../../../../core/services/note-state.service';
import { NoteService } from '../../../../core/services/note.service';

import { RecentNotesComponent } from '../../components/recent-notes/recent-notes.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RecentNotesComponent, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  logoPath: string = 'assets/images/twodo-logos/twodo-logo.svg';
  userName: string = 'Usuário';

  private destroyRef = inject(DestroyRef);
  private themeSubscription: Subscription;

  private readonly noteState = inject(NoteStateService);
  hasNotes: boolean = false;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private noteService: NoteService,
  ) {
    // Atualiza nome do usuário
    this.authService.getCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.userName = user?.name ?? 'Usuário';
      });

    // Popula o estado das notas
    this.noteService.getUserNotes().subscribe(notes => {
      const entities = notes.map(n => this.noteService.createNoteEntity(n));
      this.noteState.setUserNotes(entities);
      this.hasNotes = true;
    });

    // Atualiza logo conforme o tema
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.logoPath = theme.mode === 'dark'
        ? 'assets/images/twodo-logos/twodo-dark-logo.svg'
        : 'assets/images/twodo-logos/twodo-logo.svg';
    });
  }
}