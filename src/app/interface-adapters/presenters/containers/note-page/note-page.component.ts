import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoteService } from '../../../../core/services/note.service';
import { NoteStateService } from '../../../../core/services/note-state.service';
import { Note } from '../../../../core/entities/note.entity';

@Component({
  standalone: true,
  selector: 'app-note-page',
  imports: [],
  templateUrl: './note-page.component.html',
  styleUrls: ['./note-page.component.scss']
})
export class NotePageComponent implements OnInit {
  note: Note | null = null;

  constructor(
    private route: ActivatedRoute,
    private noteService: NoteService,
    private noteStateService: NoteStateService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const noteId = params.get('id');
      if (noteId) {
        this.noteService.getNoteById(noteId).subscribe(noteData => {
          const note = new Note(
            noteData.id,
            noteData.title,
            noteData.content,
            noteData.ownerId,
            noteData.bannerUrl,
            new Date(noteData.createdAt),
            new Date(noteData.updatedAt)
          );
          this.note = note;
          this.noteStateService.setNote(note);
        });
      }
    });
  }
}