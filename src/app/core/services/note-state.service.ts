import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Note } from '../entities/note.entity';
import { NoteService } from './note.service';

@Injectable({ providedIn: 'root' })
export class NoteStateService {
  private noteSubject = new BehaviorSubject<Note | null>(null);
  readonly note$ = this.noteSubject.asObservable();

  private hasPendingChangesSubject = new BehaviorSubject<boolean>(false);
  hasPendingChanges$ = this.hasPendingChangesSubject.asObservable();

  constructor(
    private readonly noteService: NoteService
  ) { }

  setNote(note: Note): void {
    this.noteSubject.next(note);
    this.hasPendingChangesSubject.next(false);
  }

  getCurrentNote(): Note | null {
    return this.noteSubject.getValue();
  }

  updateTitle(newTitle: string): void {
    const currentNote = this.noteSubject.value;
    if (!currentNote) return;

    const cleanTitle = newTitle.trim();
    const finalTitle = cleanTitle || 'Nova página';

    currentNote.updateTitle(finalTitle);
    this.noteSubject.next(currentNote);
    this.hasPendingChangesSubject.next(true);

    this.noteService.updateNoteTitle(currentNote.id, finalTitle).subscribe({
      next: () => {
        this.hasPendingChangesSubject.next(false);
      },
      error: () => {
        this.hasPendingChangesSubject.next(true);
      }
    });
  }

  updateContent(newContent: string): void {
    const note = this.getCurrentNote();
    if (note) {
      note.updateContent(newContent);
      this.noteSubject.next(note);
    }
  }
}
