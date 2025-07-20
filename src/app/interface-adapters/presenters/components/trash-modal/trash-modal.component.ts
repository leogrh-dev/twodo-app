import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  DestroyRef,
  inject,
  signal,
  computed,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzButtonComponent } from 'ng-zorro-antd/button';

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
    NzButtonComponent,
  ],
})
export class TrashModalComponent implements OnInit, OnDestroy {
  // ==============================
  // Outputs
  // ==============================

  /** Evento emitido ao clicar fora do modal ou apertar ESC */
  @Output() close = new EventEmitter<void>();

  // ==============================
  // Injeções
  // ==============================

  private readonly noteService = inject(NoteService);
  private readonly noteState = inject(NoteStateService);
  private readonly destroyRef = inject(DestroyRef);

  // ==============================
  // Sinais reativos
  // ==============================

  /** Valor do campo de busca */
  readonly search = signal('');

  /** Lista de notas excluídas */
  private readonly allNotes = signal<Note[]>([]);

  /** Notas filtradas pela busca */
  readonly filteredNotes = computed(() => {
    const query = this.search().toLowerCase();
    return this.allNotes().filter(note =>
      note.title.toLowerCase().includes(query)
    );
  });

  // ==============================
  // Lifecycle
  // ==============================

  ngOnInit(): void {
    this.loadDeletedNotes();
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  // ==============================
  // Ações da interface
  // ==============================

  /** Atualiza o texto da busca */
  updateSearch(query: string): void {
    this.search.set(query);
  }

  /** Restaura uma nota excluída */
  restore(noteId: string): void {
    const note = this.allNotes().find(n => n.id === noteId);
    if (!note) return;

    this.noteService.restoreNote(noteId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.allNotes.update(notes => notes.filter(n => n.id !== noteId));
        this.noteState.restoreNoteToActive(note);
      });
  }

  /** Exclui permanentemente uma nota */
  permanentlyDelete(noteId: string): void {
    this.noteService.permanentlyDeleteNote(noteId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.allNotes.update(notes => notes.filter(n => n.id !== noteId));
        this.noteState.removeFromDeletedNotes(noteId);
      });
  }

  /** Exclui permanentemente todas as notas */
  permanentlyDeleteAll(): void {
    const noteIds = this.allNotes().map(n => n.id);

    noteIds.forEach(id => {
      this.noteService.permanentlyDeleteNote(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.allNotes.update(notes => notes.filter(n => n.id !== id));
          this.noteState.removeFromDeletedNotes(id);
        });
    });
  }

  /** Fecha o modal ao clicar fora */
  handleBackdropClick(event: MouseEvent): void {
    const isBackdrop = (event.target as HTMLElement).classList.contains('trash-modal-backdrop');
    if (isBackdrop) this.close.emit();
  }

  // ==============================
  // Métodos privados
  // ==============================

  private loadDeletedNotes(): void {
    this.noteService.getDeletedNotes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(deletedNotes => {
        this.allNotes.set(deletedNotes);
        this.noteState.setDeletedNotes(deletedNotes);
      });
  }

  private readonly handleEscapeKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') this.close.emit();
  };
}