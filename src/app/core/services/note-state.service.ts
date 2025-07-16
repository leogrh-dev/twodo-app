import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';

import { Note } from '../entities/note.entity';
import { NoteService } from './note.service';

@Injectable({ providedIn: 'root' })
export class NoteStateService {
  private readonly noteSubject = new BehaviorSubject<Note | null>(null);
  readonly note$ = this.noteSubject.asObservable();

  private readonly hasPendingChangesSubject = new BehaviorSubject<boolean>(false);
  readonly hasPendingChanges$ = this.hasPendingChangesSubject.asObservable();

  private readonly userNotesSubject = new BehaviorSubject<Note[]>([]);
  readonly userNotes$ = this.userNotesSubject.asObservable();

  private readonly deletedNotesSubject = new BehaviorSubject<Note[]>([]);
  readonly deletedNotes$ = this.deletedNotesSubject.asObservable();

  private readonly pendingContent$ = new Subject<string>();
  private readonly pendingTitle$ = new Subject<string>();

  private readonly favoriteNotesSubject = new BehaviorSubject<Note[]>([]);
  readonly favoriteNotes$ = this.favoriteNotesSubject.asObservable();

  constructor(private readonly noteService: NoteService) {
    this.listenToContentUpdates();
    this.listenToTitleUpdates();
  }

  private listenToContentUpdates(): void {
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

  private listenToTitleUpdates(): void {
    this.pendingTitle$
      .pipe(debounceTime(0), distinctUntilChanged())
      .subscribe(title => {
        const note = this.getCurrentNote();
        if (!note) return;

        note.updateTitle(title);
        this.setPendingChanges(true);

        this.noteService.updateNoteTitle(note.id, title).subscribe({
          next: () => {
            this.setPendingChanges(false);
            this.updateNoteInList(note);
          },
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

  updateTitle(title: string): void {
    const clean = title.trim();
    const note = this.getCurrentNote();
    if (!note) return;

    note.updateTitle(clean);
    this.noteSubject.next(note);
    this.pendingTitle$.next(clean);
  }

  updateContent(content: string): void {
    this.pendingContent$.next(content.trim());
  }

  updateBanner(bannerUrl: string): void {
    const note = this.getCurrentNote();
    if (!note) return;

    note.updateBanner(bannerUrl.trim());
    this.noteSubject.next(note);
    this.setPendingChanges(true);

    this.noteService.updateNoteBanner(note.id, bannerUrl).subscribe({
      next: () => {
        this.setPendingChanges(false);
        this.updateNoteInList(note);
      },
      error: () => this.setPendingChanges(true),
    });
  }

  async removeBanner(): Promise<void> {
    const note = this.getCurrentNote();
    if (!note) return;

    await firstValueFrom(this.noteService.removeBanner(note.id));

    const updatedNote = new Note(
      note.id,
      note.title,
      note.content,
      note.ownerId,
      null,
      note.createdAt,
      new Date(),
      note.isDeleted,
      note.isFavorite,
      note.iconUrl
    );

    this.noteSubject.next(updatedNote);
    this.updateNoteInList(updatedNote);
  }

  async replaceBanner(bannerUrl: string): Promise<void> {
    const current = this.getCurrentNote()?.bannerUrl;
    const isS3 = current?.startsWith('http') && current.includes('amazonaws.com');

    if (isS3) {
      await this.removeBanner();
    }

    this.updateBanner(bannerUrl);
  }

  setUserNotes(notes: Note[]): void {
    const filtered = notes.filter(n => !n.isDeleted);

    const favorites = filtered.filter(n => n.isFavorite);
    const normal = filtered.filter(n => !n.isFavorite);

    this.favoriteNotesSubject.next(favorites);
    this.userNotesSubject.next(normal);
  }

  setDeletedNotes(notes: Note[]): void {
    this.deletedNotesSubject.next(notes);
  }

  getDeletedNotes(): Note[] {
    return this.deletedNotesSubject.getValue();
  }

  getFavoriteNotes(): Note[] {
    return this.favoriteNotesSubject.getValue();
  }

  getUserNotes(): Note[] {
    return this.userNotesSubject.getValue();
  }

  getDeletedNotesCount(): number {
    return this.deletedNotesSubject.getValue().length;
  }

  addUserNote(note: Note): void {
    const current = this.userNotesSubject.getValue();
    this.userNotesSubject.next([note, ...current]);
  }

  updateNoteInList(updated: Note): void {
    const notes = this.userNotesSubject.getValue();
    const list = notes.map(note => note.id === updated.id ? updated : note);
    this.userNotesSubject.next(list);
  }

  moveNoteToTrash(noteId: string): void {
    const updated = this.userNotesSubject.getValue().filter(n => n.id !== noteId);
    this.userNotesSubject.next(updated);
  }

  removeFromDeletedNotes(noteId: string): void {
    const filtered = this.deletedNotesSubject.getValue().filter(n => n.id !== noteId);
    this.deletedNotesSubject.next(filtered);
  }

  restoreNoteToActive(note: Note): void {
    this.removeFromDeletedNotes(note.id);
    this.addUserNote(note);
  }

  toggleFavoriteNote(noteId: string): void {
    const allNotes = [...this.favoriteNotesSubject.getValue(), ...this.userNotesSubject.getValue()];
    const target = allNotes.find(n => n.id === noteId);
    if (!target) return;

    target.isFavorite = !target.isFavorite;
    target.updatedAt = new Date();

    this.noteService.toggleFavoriteNote(noteId).subscribe({
      next: () => this.syncFavorites(target),
      error: () => {
        target.isFavorite = !target.isFavorite;
      },
    });
  }

  private syncFavorites(updated: Note): void {
    const favorites = this.favoriteNotesSubject.getValue();
    const normal = this.userNotesSubject.getValue();

    const isFav = updated.isFavorite;

    const newFavorites = isFav
      ? [updated, ...favorites.filter(n => n.id !== updated.id)]
      : favorites.filter(n => n.id !== updated.id);

    const newNormal = !isFav
      ? [updated, ...normal.filter(n => n.id !== updated.id)]
      : normal.filter(n => n.id !== updated.id);

    this.favoriteNotesSubject.next(newFavorites);
    this.userNotesSubject.next(newNormal);
  }

  private setPendingChanges(status: boolean): void {
    this.hasPendingChangesSubject.next(status);
  }

  noteSnapshot(): Note | null {
    const current = this.noteSubject.getValue();
    if (!current) return null;

    return new Note(
      current.id,
      current.title,
      current.content,
      current.ownerId,
      current.bannerUrl,
      current.createdAt,
      current.updatedAt,
      current.isDeleted,
      current.isFavorite
    );
  }

  async replaceIcon(iconUrl: string): Promise<void> {
    const note = this.getCurrentNote();
    if (!note) return;

    note.iconUrl = iconUrl;
    note.updatedAt = new Date();
    this.noteSubject.next(note);
    this.setPendingChanges(true);

    this.noteService.updateNoteIcon(note.id, iconUrl).subscribe({
      next: () => {
        this.setPendingChanges(false);
        this.updateNoteInList(note);
      },
      error: () => this.setPendingChanges(true),
    });
  }

  async removeIcon(): Promise<void> {
    const note = this.getCurrentNote();
    if (!note) return;

    await firstValueFrom(this.noteService.removeNoteIcon(note.id));

    const updatedNote = new Note(
      note.id,
      note.title,
      note.content,
      note.ownerId,
      note.bannerUrl,
      note.createdAt,
      new Date(),
      note.isDeleted,
      note.isFavorite,
      null
    );

    this.noteSubject.next(updatedNote);
    this.updateNoteInList(updatedNote);
  }
}