import { Component, AfterViewInit, ElementRef, NgZone, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoteService } from '../../../../core/services/note.service';
import { NoteStateService } from '../../../../core/services/note-state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-note-page',
  templateUrl: './note-page.component.html',
  styleUrls: ['./note-page.component.scss'],
  imports: []
})
export class NotePageComponent implements AfterViewInit {
  @ViewChild('reactContainer', { static: true }) reactContainer!: ElementRef<HTMLElement>;

  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);
  private readonly route = inject(ActivatedRoute);
  private readonly noteService = inject(NoteService);
  private readonly noteStateService = inject(NoteStateService);

  ngAfterViewInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const noteId = params.get('id');
        if (noteId) {
          this.loadNote(noteId);
        }
      });
  }

  ngOnDestroy(): void {
    const container = this.reactContainer.nativeElement;
    if ((window as any).unmountNotePage) {
      (window as any).unmountNotePage(container);
    }
  }

  private loadNote(noteId: string): void {
    this.noteService.getNoteById(noteId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(noteData => {
        const note = this.noteService.createNoteEntity(noteData);
        this.noteStateService.setNote(note);
        this.loadMicrofrontend(note);
      });
  }

  private loadMicrofrontend(note: any): void {
    const container = this.reactContainer.nativeElement;

    const props = {
      title: note.title,
      content: note.content,
      onTitleChange: (title: string) =>
        this.zone.run(() => this.noteStateService.updateTitle(title)),
      onContentChange: (content: string) =>
        this.zone.run(() => this.noteStateService.updateContent(content)),
    };

    const cssId = 'note-page-mfe-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = '/assets/microfrontends/note-page-mfe.css';
      document.head.appendChild(link);
    }

    const jsId = 'note-page-mfe';
    if (!document.getElementById(jsId)) {
      const script = document.createElement('script');
      script.id = jsId;
      script.src = '/assets/microfrontends/note-page-mfe.js';
      script.onload = () => {
        (window as any).renderNotePage(container, props);
      };
      document.body.appendChild(script);
    } else {
      (window as any).renderNotePage(container, props);
    }
  }
}