import { Component, EventEmitter, Output, computed, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';

import { NoteStateService } from '../../../../core/services/note-state.service';
import { Note } from '../../../../core/entities/note.entity';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NzInputModule],
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent implements OnInit, OnDestroy {
  // ==============================
  // Injeções e eventos
  // ==============================

  private readonly noteState = inject(NoteStateService);

  @Output() close = new EventEmitter<void>();
  @Output() openNote = new EventEmitter<string>();

  // ==============================
  // Estado e sinais
  // ==============================

  readonly search = signal('');
  readonly allNotes = signal<Note[]>([]);

  /** Lista de notas filtradas por título */
  readonly filteredNotes = computed(() => {
    const query = this.search().trim().toLowerCase();
    if (!query) return [];

    return this.allNotes().filter(note =>
      note.title.toLowerCase().includes(query)
    );
  });

  // ==============================
  // Lifecycle
  // ==============================

  ngOnInit(): void {
    document.addEventListener('keydown', this.handleEscapeKey);

    this.noteState.userNotes$.subscribe(notes => {
      this.allNotes.set(notes);
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  // ==============================
  // Ações do usuário
  // ==============================

  updateSearch(query: string): void {
    this.search.set(query);
  }

  handleBackdropClick(event: MouseEvent): void {
    const isBackdrop = (event.target as HTMLElement).classList.contains('search-modal-backdrop');
    if (isBackdrop) this.close.emit();
  }

  onNoteClick(noteId: string): void {
    this.openNote.emit(noteId);
    this.close.emit();
  }

  // ==============================
  // Acessibilidade
  // ==============================

  /** Fecha o modal ao pressionar Esc */
  private readonly handleEscapeKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') this.close.emit();
  };
}