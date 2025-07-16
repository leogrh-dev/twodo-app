import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Note } from '../../../../core/entities/note.entity';
import { NoteStateService } from '../../../../core/services/note-state.service';
import { NoteService } from '../../../../core/services/note.service';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-recent-notes',
  standalone: true,
  imports: [CommonModule, RouterModule, NzToolTipModule],
  templateUrl: './recent-notes.component.html',
  styleUrls: ['./recent-notes.component.scss']
})
export class RecentNotesComponent {
  private readonly noteState = inject(NoteStateService);
  private readonly noteService = inject(NoteService);
  private readonly router = inject(Router);

  readonly recentNotes = signal<Note[]>([]);

  constructor() {
    effect(() => {
      const allNotes = [
        ...this.noteState.getFavoriteNotes(),
        ...this.noteState.getUserNotes()
      ];

      const sorted = allNotes
        .filter(n => !n.isDeleted)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, 4);

      this.recentNotes.set(sorted);
    });
  }

  isImage(url: string): boolean {
    return url?.startsWith('http');
  }

  getBackgroundStyle(note: Note): { [key: string]: string } {
    if (!note.bannerUrl) {
      return { backgroundColor: 'var(--background-terciary)' };
    }

    if (note.bannerUrl.startsWith('#')) {
      return { backgroundColor: note.bannerUrl };
    }

    return {
      backgroundImage: `url('${note.bannerUrl}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  }

  createNewNote(): void {
    this.noteService.createNote().subscribe(note => {
      if (note?.id) {
        this.router.navigate(['/note', note.id]);
      }
    });
  }
}