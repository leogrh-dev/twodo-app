import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  OnInit,
  OnDestroy
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';

import { Note } from '../../../../core/entities/note.entity';

@Component({
  selector: 'app-all-group-notes-modal',
  standalone: true,
  templateUrl: './all-group-notes-modal.component.html',
  styleUrls: ['./all-group-notes-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule
  ],
})
export class AllGroupNotesModalComponent implements OnInit, OnDestroy {
  @Input({ required: true }) notes: Note[] = [];
  @Input({ required: true }) group: 'user' | 'favorites' = 'user';
  @Input({ required: true }) title: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() openNote = new EventEmitter<string>();

  readonly search = signal('');

  readonly filteredNotes = computed(() => {
    const query = this.search().toLowerCase();
    return this.notes.filter(note =>
      note.title.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  updateSearch(query: string): void {
    this.search.set(query);
  }

  handleBackdropClick(event: MouseEvent): void {
    const isBackdrop = (event.target as HTMLElement).classList.contains('all-group-notes-modal-backdrop');
    if (isBackdrop) this.close.emit();
  }

  onNoteClick(noteId: string): void {
    this.openNote.emit(noteId);
    this.close.emit();
  }

  private readonly handleEscapeKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') this.close.emit();
  };
}