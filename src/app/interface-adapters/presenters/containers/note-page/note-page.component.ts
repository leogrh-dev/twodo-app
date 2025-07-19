import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  NgZone,
  inject,
  DestroyRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NoteService } from '../../../../core/services/note.service';
import { NoteStateService } from '../../../../core/services/note-state.service';
import { NoteBannerComponent } from '../../components/note-banner/note-banner.component';

@Component({
  standalone: true,
  selector: 'app-note-page',
  templateUrl: './note-page.component.html',
  styleUrls: ['./note-page.component.scss'],
  imports: [NoteBannerComponent],
})
export class NotePageComponent implements AfterViewInit, OnDestroy {
  // ==============================
  // ViewChilds
  // ==============================

  @ViewChild('reactContainer', { static: true })
  private reactContainer!: ElementRef<HTMLElement>;

  // ==============================
  // Injeções
  // ==============================

  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);
  private readonly route = inject(ActivatedRoute);
  private readonly noteService = inject(NoteService);
  private readonly noteStateService = inject(NoteStateService);

  // ==============================
  // Lifecycle
  // ==============================

  ngAfterViewInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const noteId = params.get('id');
        if (noteId) this.loadNote(noteId);
      });
  }

  ngOnDestroy(): void {
    const container = this.reactContainer.nativeElement;
    if ((window as any).unmountNotePage) {
      (window as any).unmountNotePage(container);
    }
  }

  // ==============================
  // Métodos privados
  // ==============================

  /** Obtém dados da nota e carrega o microfrontend */
  private loadNote(noteId: string): void {
    this.noteService
      .getNoteById(noteId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(noteData => {
        const note = this.noteService.createNoteEntity(noteData);
        this.noteStateService.setNote(note);
        this.mountMicrofrontend(note);
      });
  }

  /** Injeta/atualiza microfrontend React com propriedades */
  private mountMicrofrontend(note: any): void {
    const container = this.reactContainer.nativeElement;
    const props = {
      title: note.title,
      content: note.content,
      onTitleChange: (title: string) =>
        this.zone.run(() => this.noteStateService.updateTitle(title)),
      onContentChange: (content: string) =>
        this.zone.run(() => this.noteStateService.updateContent(content)),
    };

    // Carrega CSS do microfrontend (se ainda não estiver carregado)
    const cssId = 'note-page-mfe-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = '/assets/microfrontends/note-page-mfe.css';
      document.head.appendChild(link);
    }

    // Carrega JS do microfrontend e renderiza (ou re-renderiza se já carregado)
    const jsId = 'note-page-mfe';
    const render = () => (window as any).renderNotePage(container, props);

    if (!document.getElementById(jsId)) {
      const script = document.createElement('script');
      script.id = jsId;
      script.src = '/assets/microfrontends/note-page-mfe.js';
      script.onload = render;
      document.body.appendChild(script);
    } else {
      render();
    }
  }
}