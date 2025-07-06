import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { CREATE_NOTE_MUTATION, GET_NOTE_BY_ID_QUERY, GET_USER_NOTES_QUERY, REMOVE_NOTE_BANNER_MUTATION, UPDATE_NOTE_BANNER_MUTATION, UPDATE_NOTE_CONTENT_MUTATION, UPDATE_NOTE_TITLE_MUTATION } from '../../infrastructure/graphql/note.graphql';
import { Observable } from 'rxjs';
import { Note } from '../entities/note.entity';

@Injectable({ providedIn: 'root' })
export class NoteService {
  constructor(private apollo: Apollo) { }

  createNoteEntity(noteData: any): Note {
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

  createNote() {
    return this.apollo
      .mutate<{ createNote: { id: string } }>({
        mutation: CREATE_NOTE_MUTATION,
      })
      .pipe(map(result => result.data?.createNote));
  }

  getNoteById(id: string): Observable<any> {
    return this.apollo
      .watchQuery<{ getNoteById: any }>({
        query: GET_NOTE_BY_ID_QUERY,
        variables: { id },
        fetchPolicy: 'cache-and-network',
      })
      .valueChanges.pipe(map(result => result.data.getNoteById));
  }

  updateNoteTitle(id: string, title: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: UPDATE_NOTE_TITLE_MUTATION,
        variables: {
          input: {
            id,
            title,
          }
        },
      })
      .pipe(map(() => void 0));
  }

  updateNoteContent(id: string, content: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: UPDATE_NOTE_CONTENT_MUTATION,
        variables: { input: { id, content } },
      })
      .pipe(map(() => void 0));
  }

  getUserNotes(): Observable<{ id: string; title: string }[]> {
    return this.apollo
      .watchQuery<{ getUserNotes: { id: string; title: string }[] }>({
        query: GET_USER_NOTES_QUERY,
        fetchPolicy: 'cache-and-network',
      })
      .valueChanges.pipe(map(result => result.data.getUserNotes));
  }

  updateNoteBanner(id: string, bannerUrl: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: UPDATE_NOTE_BANNER_MUTATION,
        variables: {
          input: {
            id,
            bannerUrl,
          },
        },
      })
      .pipe(map(() => void 0));
  }

  removeBanner(noteId: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: REMOVE_NOTE_BANNER_MUTATION,
        variables: {
          input: { id: noteId },
        },
      })
      .pipe(map(() => void 0));
  }
}