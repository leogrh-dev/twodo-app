import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, OnInit, Output, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

import { NoteService } from '../../../../core/services/note.service';
import { NoteStateService } from '../../../../core/services/note-state.service';
import { Note } from '../../../../core/entities/note.entity';

@Component({
  selector: 'app-trash-modal',
  standalone: true,
  templateUrl: './trash-modal.component.html',
  styleUrls: ['./trash-modal.component.scss'],
  imports: [
    CommonModule,
    NzInputModule,
    NzToolTipModule,
    NzPopconfirmModule,
  ],
})
export class TrashModalComponent implements OnInit {
  private readonly noteService = inject(NoteService);
  private readonly noteState = inject(NoteStateService);
  private readonly destroyRef = inject(DestroyRef);

  @Output() close = new EventEmitter<void>();

  private readonly allNotes = signal<Note[]>([]);
  readonly search = signal('');

  readonly filteredNotes = computed(() => {
    const query = this.search().toLowerCase();
    return this.allNotes().filter(note =>
      note.title.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadDeletedNotes();
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  private loadDeletedNotes(): void {
    this.noteService
      .getDeletedNotes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(deletedNotes => {
        this.allNotes.set(deletedNotes);
        this.noteState.setDeletedNotes(deletedNotes);
      });
  }

  updateSearch(query: string): void {
    this.search.set(query);
  }

  restore(noteId: string): void {
    const note = this.allNotes().find(n => n.id === noteId);
    if (!note) return;

    this.noteService
      .restoreNote(noteId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.allNotes.update(notes => notes.filter(n => n.id !== noteId));
        this.noteState.restoreNoteToActive(note);
      });
  }

  permanentlyDelete(noteId: string): void {
    this.noteService
      .permanentlyDeleteNote(noteId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.allNotes.update(notes => notes.filter(n => n.id !== noteId));
        this.noteState.removeFromDeletedNotes(noteId);
      });
  }

  handleBackdropClick(event: MouseEvent): void {
    const isBackdrop = (event.target as HTMLElement).classList.contains('trash-modal-backdrop');
    if (isBackdrop) this.close.emit();
  }

  private readonly handleEscapeKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') this.close.emit();
  };
}