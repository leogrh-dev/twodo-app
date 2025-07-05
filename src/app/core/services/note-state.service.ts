import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Note } from '../entities/note.entity';
import { NoteService } from './note.service';

@Injectable({ providedIn: 'root' })
export class NoteStateService {
  private readonly noteSubject = new BehaviorSubject<Note | null>(null);
  readonly note$ = this.noteSubject.asObservable();

  private readonly hasPendingChangesSubject = new BehaviorSubject<boolean>(false);
  readonly hasPendingChanges$ = this.hasPendingChangesSubject.asObservable();

  private readonly pendingContent$ = new Subject<string>();
  private readonly pendingTitle$ = new Subject<string>();

  constructor(private readonly noteService: NoteService) {
    this.handleDebouncedContentUpdates();
    this.handleDebouncedTitleUpdates();
  }

  private handleDebouncedContentUpdates(): void {
    this.pendingContent$
      .pipe(debounceTime(2000), distinctUntilChanged())
      .subscribe(content => {
        const note = this.getCurrentNote();
        if (!note) return;

        note.updateContent(content);
        this.setPendingChanges(true);

        this.noteService.updateNoteContent(note.id, content).subscribe({
          next: () => this.setPendingChanges(false),
          error: () => this.setPendingChanges(true),
        });
      });
  }

  private handleDebouncedTitleUpdates(): void {
    this.pendingTitle$
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(title => {
        const note = this.getCurrentNote();
        if (!note) return;

        note.updateTitle(title);
        this.setPendingChanges(true);

        this.noteService.updateNoteTitle(note.id, title).subscribe({
          next: () => this.setPendingChanges(false),
          error: () => this.setPendingChanges(true),
        });
      });
  }

  setNote(note: Note): void {
    this.noteSubject.next(note);
    this.setPendingChanges(false);
  }

  getCurrentNote(): Note | null {
    return this.noteSubject.getValue();
  }

  updateTitle(newTitle: string): void {
    const clean = newTitle.trim();

    const note = this.getCurrentNote();
    if (!note) return;

    note.updateTitle(clean);
    this.noteSubject.next(note);

    this.pendingTitle$.next(clean);
  }

  updateContent(newContent: string): void {
    const clean = newContent.trim();
    this.pendingContent$.next(clean);
  }

  private setPendingChanges(status: boolean): void {
    this.hasPendingChangesSubject.next(status);
  }
}
