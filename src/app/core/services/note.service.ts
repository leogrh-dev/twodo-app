import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import {
  CREATE_NOTE_MUTATION,
  GET_DELETED_NOTES_QUERY,
  GET_NOTE_BY_ID_QUERY,
  GET_USER_NOTES_QUERY,
  PERMANENTLY_DELETE_NOTE_MUTATION,
  REMOVE_NOTE_BANNER_MUTATION,
  RESTORE_NOTE_MUTATION,
  SOFT_DELETE_NOTE_MUTATION,
  UPDATE_NOTE_BANNER_MUTATION,
  UPDATE_NOTE_CONTENT_MUTATION,
  UPDATE_NOTE_TITLE_MUTATION
} from '../../infrastructure/graphql/note.graphql';

import { Note } from '../entities/note.entity';

@Injectable({ providedIn: 'root' })
export class NoteService {
  constructor(private readonly apollo: Apollo) { }

  createNoteEntity(data: any): Note {
    return new Note(
      data.id,
      data.title,
      data.content,
      data.ownerId,
      data.bannerUrl,
      new Date(data.createdAt),
      new Date(data.updatedAt),
      data.isDeleted
    );
  }

  createNote(): Observable<{ id: string } | undefined> {
    return this.apollo
      .mutate<{ createNote: { id: string } }>({ mutation: CREATE_NOTE_MUTATION })
      .pipe(map(result => result.data?.createNote));
  }

  getNoteById(id: string): Observable<any> {
    return this.apollo
      .watchQuery<{ getNoteById: any }>({
        query: GET_NOTE_BY_ID_QUERY,
        variables: { id },
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(map(result => result.data.getNoteById));
  }

  getUserNotes(): Observable<any[]> {
    return this.apollo
      .watchQuery<{ getUserNotes: any[] }>({
        query: GET_USER_NOTES_QUERY,
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(map(result => result.data.getUserNotes));
  }

  getDeletedNotes(): Observable<Note[]> {
    return this.apollo
      .watchQuery<{ getDeletedNotes: any[] }>({
        query: GET_DELETED_NOTES_QUERY,
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        map(result => result.data.getDeletedNotes.map(this.createNoteEntity))
      );
  }

  updateNoteTitle(id: string, title: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: UPDATE_NOTE_TITLE_MUTATION,
        variables: { input: { id, title } },
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

  updateNoteBanner(id: string, bannerUrl: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: UPDATE_NOTE_BANNER_MUTATION,
        variables: { input: { id, bannerUrl } },
      })
      .pipe(map(() => void 0));
  }

  removeBanner(id: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: REMOVE_NOTE_BANNER_MUTATION,
        variables: { input: { id } },
      })
      .pipe(map(() => void 0));
  }

  restoreNote(id: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: RESTORE_NOTE_MUTATION,
        variables: { id },
      })
      .pipe(map(() => void 0));
  }

  permanentlyDeleteNote(id: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: PERMANENTLY_DELETE_NOTE_MUTATION,
        variables: { id },
      })
      .pipe(map(() => void 0));
  }

  softDeleteNote(id: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: SOFT_DELETE_NOTE_MUTATION,
        variables: { id },
        refetchQueries: ['GetNoteById', 'GetUserNotes'],
      })
      .pipe(map(() => void 0));
  }
}