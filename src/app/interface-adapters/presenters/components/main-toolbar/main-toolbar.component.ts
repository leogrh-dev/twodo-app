import { Component, DestroyRef, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';

import { NoteStateService } from '../../../../core/services/note-state.service';

@Component({
  selector: 'app-main-toolbar',
  standalone: true,
  templateUrl: './main-toolbar.component.html',
  styleUrl: './main-toolbar.component.scss',
  imports: [
    CommonModule,
    NzToolTipModule,
    NzDropDownModule,
    FormsModule,
    NzInputModule,
  ]
})
export class MainToolbarComponent implements OnInit {
  // ==============================
  // Constantes
  // ==============================
  private static readonly NOTE_ROUTE_PREFIX = '/note/';
  private static readonly DEFAULT_PAGE_TITLE = 'Nova página';

  // ==============================
  // Inputs e Outputs
  // ==============================
  @Input() isCollapsed: boolean = false;
  @Output() toggleSidemenu = new EventEmitter<void>();

  // ==============================
  // Estado local
  // ==============================
  noteTitle = MainToolbarComponent.DEFAULT_PAGE_TITLE;
  isInNotePage = false;
  isEditing = false;
  isFavorite = false;
  draftTitle = '';

  // ==============================
  // Streams e injeções
  // ==============================
  private readonly titleInput$ = new Subject<string>();
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly noteStateService: NoteStateService,
    private readonly router: Router
  ) { }

  // ==============================
  // Lifecycle
  // ==============================
  ngOnInit(): void {
    this.updateNotePageStatus();
    this.setupRouterSubscription();
    this.setupNoteSubscription();
    this.setupTitleInputSubscription();
  }

  // ==============================
  // Eventos de título
  // ==============================
  onTitleInputChange(value: string): void {
    this.titleInput$.next(value);
  }

  onDropdownOpen(): void {
    this.resetDraftTitle();
  }

  // ==============================
  // Atualizações de título
  // ==============================
  private processTitleUpdate(newTitle: string): void {
    const cleanTitle = newTitle.trim();
    if (this.isTitleValid(cleanTitle)) {
      this.noteStateService.updateTitle(cleanTitle);
    }
  }

  private isTitleValid(title: string): boolean {
    return title.length > 0;
  }

  private updateNoteTitle(title: string | undefined): void {
    const cleanTitle = title?.trim();
    this.noteTitle = cleanTitle || MainToolbarComponent.DEFAULT_PAGE_TITLE;
  }

  private resetDraftTitle(): void {
    this.draftTitle = '';
  }

  // ==============================
  // Subscrições
  // ==============================
  private setupRouterSubscription(): void {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateNotePageStatus();
      });
  }

  private setupNoteSubscription(): void {
    this.noteStateService.note$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(note => {
        this.updateNoteTitle(note?.title);
        this.isFavorite = note?.isFavorite ?? false;
      });
  }

  private setupTitleInputSubscription(): void {
    this.titleInput$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(newTitle => {
        this.processTitleUpdate(newTitle);
      });
  }

  // ==============================
  // Lógica de página
  // ==============================
  private updateNotePageStatus(): void {
    this.isInNotePage = this.router.url.startsWith(MainToolbarComponent.NOTE_ROUTE_PREFIX);
  }

  // ==============================
  // Favoritar
  // ==============================
  toggleFavorite(): void {
    const currentNote = this.noteStateService.noteSnapshot();
    if (!currentNote?.id) return;

    this.noteStateService.toggleFavoriteNote(currentNote.id);
    this.isFavorite = !this.isFavorite;
  }
}