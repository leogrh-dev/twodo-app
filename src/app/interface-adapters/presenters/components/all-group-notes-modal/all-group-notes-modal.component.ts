import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  OnInit,
  OnDestroy,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

import { NoteStateService } from '../../../../core/services/note-state.service';
import { Note } from '../../../../core/entities/note.entity';
import { NoteService } from '../../../../core/services/note.service';

@Component({
  selector: 'app-all-group-notes-modal',
  standalone: true,
  templateUrl: './all-group-notes-modal.component.html',
  styleUrls: ['./all-group-notes-modal.component.scss'],
  imports: [CommonModule, FormsModule, NzInputModule, NzDropDownModule]
})
export class AllGroupNotesModalComponent implements OnInit, OnDestroy {
  private readonly noteStateService = inject(NoteStateService);
  private readonly noteService = inject(NoteService);

  // ======================
  // Inputs e Outputs
  // ======================

  /** Tipo do grupo ('user' ou 'favorites') */
  @Input({ required: true }) group: 'user' | 'favorites' = 'user';

  /** Título do grupo (ex: 'Favoritos', 'Minhas anotações') */
  @Input({ required: true }) title: string = '';

  /** Lista de todas as notas que chegam do componente pai */
  @Input() set notes(value: Note[]) {
    this.allNotes.set(value);
  }

  /** Evento emitido ao clicar fora do modal */
  @Output() close = new EventEmitter<void>();

  /** Evento emitido ao clicar em uma nota */
  @Output() openNote = new EventEmitter<string>();

  // ======================
  // Estado e Computeds
  // ======================

  /** Termo de busca digitado */
  readonly search = signal('');

  /** DestroyRef */
  readonly destroyRef = inject(DestroyRef);

  /** Título temporário para renomear uma nota */
  draftTitle = '';

  /** Lista de notas recebida do componente pai */
  private readonly allNotes = signal<Note[]>([]);

  /** Lista de notas filtradas pela busca */
  readonly filteredNotes = computed(() => {
    const query = this.search().toLowerCase();
    const result = this.allNotes().filter(note =>
      note.title.toLowerCase().includes(query)
    );

    console.log('[AllGroupNotesModal] filteredNotes result:', result.length);
    return result;
  });

  // ======================
  // Ciclo de vida
  // ======================

  ngOnInit(): void {
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  // ======================
  // Manipuladores de UI
  // ======================

  /** Atualiza o termo de busca */
  updateSearch(query: string): void {
    this.search.set(query);
  }

  /** Fecha o modal ao clicar no backdrop */
  handleBackdropClick(event: MouseEvent): void {
    const isBackdrop = (event.target as HTMLElement).classList.contains('all-group-notes-modal-backdrop');
    if (isBackdrop) this.close.emit();
  }

  /** Abre uma nota e fecha o modal */
  onNoteClick(noteId: string): void {
    this.openNote.emit(noteId);
    this.close.emit();
  }

  /** Alterna o status de favorito de uma nota */
  toggleFavoriteNote(noteId: string): void {
    this.noteStateService.toggleFavoriteNote(noteId);
  }

  /** Move uma nota para a lixeira */
  softDeleteNote(noteId: string): void {
    this.noteService.softDeleteNote(noteId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.noteStateService.moveNoteToTrash(noteId);
      });
  }

  /** Atualiza o título da nota sendo editada */
  onTitleInputChange(newTitle: string): void {
    const trimmed = newTitle.trim();
    if (trimmed.length > 0) {
      this.noteStateService.updateTitle(trimmed);
    }
  }

  /** Fecha o modal ao pressionar ESC */
  private readonly handleEscapeKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') this.close.emit();
  };
}