import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { CREATE_NOTE_MUTATION, GET_NOTE_BY_ID_QUERY, GET_USER_NOTES_QUERY, UPDATE_NOTE_TITLE_MUTATION } from '../../infrastructure/graphql/note.graphql';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NoteService {
  constructor(private apollo: Apollo) { }

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

  getUserNotes(): Observable<{ id: string; title: string }[]> {
    return this.apollo
      .watchQuery<{ getUserNotes: { id: string; title: string }[] }>({
        query: GET_USER_NOTES_QUERY,
        fetchPolicy: 'cache-and-network',
      })
      .valueChanges.pipe(map(result => result.data.getUserNotes));
  }
}