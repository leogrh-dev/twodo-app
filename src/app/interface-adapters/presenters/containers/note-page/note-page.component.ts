import { Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { NoteService } from '../../../../core/services/note.service';
import { NoteStateService } from '../../../../core/services/note-state.service';
import { Note } from '../../../../core/entities/note.entity';

interface NoteDisplayState {
  isTitleEmpty: boolean;
  isContentEmpty: boolean;
  hasFocused: boolean;
}

interface NoteData {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  bannerUrl?: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  standalone: true,
  selector: 'app-note-page',
  imports: [],
  templateUrl: './note-page.component.html',
  styleUrls: ['./note-page.component.scss']
})
export class NotePageComponent implements OnInit {
  private static readonly DEFAULT_NOTE_TITLE = 'Nova página';

  @ViewChild('titleEl', { static: false }) titleEl!: ElementRef<HTMLElement>;
  @ViewChild('contentEl', { static: false }) contentEl!: ElementRef<HTMLElement>;

  note: Note | null = null;

  displayState: NoteDisplayState = {
    isTitleEmpty: true,
    isContentEmpty: true,
    hasFocused: false,
  };

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly noteService: NoteService,
    private readonly noteStateService: NoteStateService
  ) { }

  get isTitleEmpty(): boolean {
    return this.displayState.isTitleEmpty;
  }

  get isContentEmpty(): boolean {
    return this.displayState.isContentEmpty;
  }

  ngOnInit(): void {
    this.setupNoteSubscription();
  }

  onTitleInput(event: Event): void {
    const element = event.target as HTMLElement;
    const newTitle = this.extractTextContent(element);
    const finalTitle = this.processTitleInput(newTitle);

    this.displayState.isTitleEmpty = this.isEmpty(newTitle);
    this.noteStateService.updateTitle(finalTitle);
  }

  onTitleKeydown(event: KeyboardEvent): void {
    if (this.isEnterKey(event)) {
      event.preventDefault();
      this.focusContentElement();
    }
  }

  onTitleFocus(): void {
    this.displayState.hasFocused = true;
    this.handleTitleFocus();
  }

  onTitlePaste(event: ClipboardEvent): void {
    event.preventDefault();
    this.handlePasteEvent(event);
  }

  onContentInput(event: Event): void {
    const element = event.target as HTMLElement;
    const content = element.innerHTML.trim();

    this.displayState.isContentEmpty = this.isEmpty(element.innerText);
    this.noteStateService.updateContent(content);
  }

  private setupNoteSubscription(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const noteId = params.get('id');
        if (noteId) {
          this.loadNote(noteId);
        }
      });
  }

  private loadNote(noteId: string): void {
    this.noteService.getNoteById(noteId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(noteData => {
        this.processNoteData(noteData);
      });
  }

  private processNoteData(noteData: NoteData): void {
    const note = this.createNoteFromData(noteData);
    this.note = note;
    this.noteStateService.setNote(note);

    this.updateDisplayState(note);
    this.updateElementsContent(note);
  }

  private createNoteFromData(noteData: NoteData): Note {
    return new Note(
      noteData.id,
      noteData.title,
      noteData.content,
      noteData.ownerId,
      noteData.bannerUrl,
      new Date(noteData.createdAt),
      new Date(noteData.updatedAt)
    );
  }

  private updateDisplayState(note: Note): void {
    this.displayState.isTitleEmpty = this.isTitleEmptyState(note.title);
    this.displayState.isContentEmpty = this.isEmpty(note.content);
  }

  private updateElementsContent(note: Note): void {
    if (!this.displayState.hasFocused) {
      queueMicrotask(() => {
        this.setTitleElementContent(note.title);
        this.setContentElementContent(note.content);
      });
    }
  }

  private setTitleElementContent(title: string): void {
    const displayTitle = this.shouldDisplayTitle(title) ? title : '';
    this.titleEl.nativeElement.innerText = displayTitle;
  }

  private setContentElementContent(content: string | null): void {
    this.contentEl.nativeElement.innerHTML = content ?? '';
  }

  private processTitleInput(title: string): string {
    return this.isEmpty(title) ? NotePageComponent.DEFAULT_NOTE_TITLE : title;
  }

  private handleTitleFocus(): void {
    const currentTitle = this.noteStateService.getCurrentNote()?.title?.trim();

    if (this.shouldClearTitleOnFocus(currentTitle)) {
      queueMicrotask(() => {
        this.clearTitleAndSetCursor();
      });
    }
  }

  private shouldClearTitleOnFocus(title: string | undefined): boolean {
    return !title || title === NotePageComponent.DEFAULT_NOTE_TITLE;
  }

  private clearTitleAndSetCursor(): void {
    this.titleEl.nativeElement.innerText = '';
    this.setCursorAtStart(this.titleEl.nativeElement);
  }

  private setCursorAtStart(element: HTMLElement): void {
    const range = document.createRange();
    const selection = window.getSelection();

    range.setStart(element, 0);
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  private handlePasteEvent(event: ClipboardEvent): void {
    const text = this.extractClipboardText(event);
    const selection = window.getSelection();

    if (!this.isValidSelection(selection)) return;

    this.insertTextAtSelection(selection!, text);
    this.triggerTitleInputUpdate();
  }

  private extractClipboardText(event: ClipboardEvent): string {
    return event.clipboardData?.getData('text/plain') ?? '';
  }

  private isValidSelection(selection: Selection | null): boolean {
    return selection !== null && selection.rangeCount > 0;
  }

  private insertTextAtSelection(selection: Selection, text: string): void {
    selection.deleteFromDocument();

    const textNode = document.createTextNode(text);
    const range = selection.getRangeAt(0);

    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
  }

  private triggerTitleInputUpdate(): void {
    queueMicrotask(() => {
      const mockEvent = { target: this.titleEl.nativeElement } as unknown as Event;
      this.onTitleInput(mockEvent);
    });
  }

  private extractTextContent(element: HTMLElement): string {
    return element.innerText.trim();
  }

  private isEmpty(text: string | null | undefined): boolean {
    return !text || text.trim().length === 0;
  }

  private isTitleEmptyState(title: string): boolean {
    return this.isEmpty(title) || title === NotePageComponent.DEFAULT_NOTE_TITLE;
  }

  private shouldDisplayTitle(title: string): boolean {
    return title !== NotePageComponent.DEFAULT_NOTE_TITLE;
  }

  private isEnterKey(event: KeyboardEvent): boolean {
    return event.key === 'Enter';
  }

  private focusContentElement(): void {
    this.contentEl?.nativeElement.focus();
  }
}