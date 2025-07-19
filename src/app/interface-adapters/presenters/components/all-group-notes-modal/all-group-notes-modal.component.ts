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
import { Note } from '../../../../core/entities/note.entity';
import { NoteStateService } from '../../../../core/services/note-state.service';

@Component({
  selector: 'app-all-group-notes-modal',
  standalone: true,
  templateUrl: './all-group-notes-modal.component.html',
  styleUrls: ['./all-group-notes-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzDropDownModule
  ]
})
export class AllGroupNotesModalComponent implements OnInit, OnDestroy {
  private readonly noteStateService = inject(NoteStateService);

  // ======================
  // Inputs e Outputs
  // ======================

  /** Lista de notas a serem exibidas */
  @Input({ required: true }) notes: Note[] = [];

  /** Tipo do grupo ('user' ou 'favorites') */
  @Input({ required: true }) group: 'user' | 'favorites' = 'user';

  /** Título do grupo (ex: 'Favoritos', 'Minhas anotações') */
  @Input({ required: true }) title: string = '';

  /** Evento emitido ao clicar fora do modal */
  @Output() close = new EventEmitter<void>();

  /** Evento emitido ao clicar em uma nota */
  @Output() openNote = new EventEmitter<string>();

  // ======================
  // Estado e Computeds
  // ======================

  /** Termo de busca digitado */
  readonly search = signal('');

  /** Título temporário para renomear uma nota */
  draftTitle = '';

  /** Lista de notas filtradas pela busca */
  readonly filteredNotes = computed(() => {
    const query = this.search().toLowerCase();
    return this.notes.filter(note =>
      note.title.toLowerCase().includes(query)
    );
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
    this.noteStateService.moveNoteToTrash(noteId);
    this.notes = this.notes.filter(note => note.id !== noteId);
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