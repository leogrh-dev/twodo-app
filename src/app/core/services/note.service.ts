import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Observable, OperatorFunction } from 'rxjs';

import {
  CREATE_NOTE_MUTATION,
  GET_DELETED_NOTES_QUERY,
  GET_NOTE_BY_ID_QUERY,
  GET_USER_NOTES_QUERY,
  PERMANENTLY_DELETE_NOTE_MUTATION,
  REMOVE_NOTE_BANNER_MUTATION,
  REMOVE_NOTE_ICON_MUTATION,
  RESTORE_NOTE_MUTATION,
  SOFT_DELETE_NOTE_MUTATION,
  TOGGLE_FAVORITE_NOTE_MUTATION,
  UPDATE_NOTE_BANNER_MUTATION,
  UPDATE_NOTE_CONTENT_MUTATION,
  UPDATE_NOTE_ICON_MUTATION,
  UPDATE_NOTE_TITLE_MUTATION
} from '../../infrastructure/graphql/note.graphql';

import { Note } from '../entities/note.entity';

interface NoteResponse {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  bannerUrl?: string | null;
  iconUrl?: string | null;
  isDeleted: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class NoteService {
  constructor(private readonly apollo: Apollo) { }

  // ======================
  // Utilitários internos
  // ======================

  /** Converte resposta da API em entidade Note */
  public createNoteEntity(data: NoteResponse): Note {
    return new Note(
      data.id,
      data.title,
      data.content,
      data.ownerId,
      data.bannerUrl ?? null,
      new Date(data.createdAt),
      new Date(data.updatedAt),
      data.isDeleted,
      data.isFavorite ?? false,
      data.iconUrl ?? null
    );
  }

  /** Pipe de resposta vazia para mutations */
  private voidResponse(): OperatorFunction<any, void> {
    return map(() => void 0);
  }

  // ======================
  // Criação
  // ======================

  /** Cria uma nova nota vazia */
  createNote(): Observable<{ id: string } | undefined> {
    return this.apollo
      .mutate<{ createNote: { id: string } }>({
        mutation: CREATE_NOTE_MUTATION,
      })
      .pipe(map(result => result.data?.createNote));
  }

  // ======================
  // Leitura
  // ======================

  /** Retorna uma nota por ID */
  getNoteById(id: string): Observable<NoteResponse> {
    return this.apollo
      .watchQuery<{ getNoteById: NoteResponse }>({
        query: GET_NOTE_BY_ID_QUERY,
        variables: { id },
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(map(result => result.data.getNoteById));
  }

  /** Retorna as notas ativas do usuário */
  getUserNotes(): Observable<NoteResponse[]> {
    return this.apollo
      .watchQuery<{ getUserNotes: NoteResponse[] }>({
        query: GET_USER_NOTES_QUERY,
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(map(result => result.data.getUserNotes));
  }

  /** Retorna as notas deletadas (lixeira) */
  getDeletedNotes(): Observable<Note[]> {
    return this.apollo
      .watchQuery<{ getDeletedNotes: NoteResponse[] }>({
        query: GET_DELETED_NOTES_QUERY,
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        map(result => result.data.getDeletedNotes.map(this.createNoteEntity))
      );
  }

  // ======================
  // Atualizações
  // ======================

  /** Atualiza o título da nota */
  updateNoteTitle(id: string, title: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: UPDATE_NOTE_TITLE_MUTATION,
        variables: { input: { id, title } },
      })
      .pipe(this.voidResponse());
  }

  /** Atualiza o conteúdo da nota */
  updateNoteContent(id: string, content: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: UPDATE_NOTE_CONTENT_MUTATION,
        variables: { input: { id, content } },
      })
      .pipe(this.voidResponse());
  }

  /** Atualiza o banner da nota */
  updateNoteBanner(id: string, bannerUrl: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: UPDATE_NOTE_BANNER_MUTATION,
        variables: { input: { id, bannerUrl } },
      })
      .pipe(this.voidResponse());
  }

  /** Atualiza o ícone da nota */
  updateNoteIcon(id: string, iconUrl: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: UPDATE_NOTE_ICON_MUTATION,
        variables: { input: { id, iconUrl } },
      })
      .pipe(this.voidResponse());
  }

  // ======================
  // Remoções parciais
  // ======================

  /** Remove banner da nota */
  removeBanner(id: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: REMOVE_NOTE_BANNER_MUTATION,
        variables: { input: { id } },
      })
      .pipe(this.voidResponse());
  }

  /** Remove ícone da nota */
  removeNoteIcon(id: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: REMOVE_NOTE_ICON_MUTATION,
        variables: { input: { id } },
      })
      .pipe(this.voidResponse());
  }

  // ======================
  // Ações
  // ======================

  /** Alterna o status de favorito */
  toggleFavoriteNote(id: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: TOGGLE_FAVORITE_NOTE_MUTATION,
        variables: { id },
      })
      .pipe(this.voidResponse());
  }

  /** Restaura uma nota da lixeira */
  restoreNote(id: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: RESTORE_NOTE_MUTATION,
        variables: { id },
      })
      .pipe(this.voidResponse());
  }

  /** Deleta permanentemente a nota */
  permanentlyDeleteNote(id: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: PERMANENTLY_DELETE_NOTE_MUTATION,
        variables: { id },
      })
      .pipe(this.voidResponse());
  }

  /** Move a nota para a lixeira (soft delete) */
  softDeleteNote(id: string): Observable<void> {
    return this.apollo
      .mutate({
        mutation: SOFT_DELETE_NOTE_MUTATION,
        variables: { id },
        refetchQueries: ['GetNoteById', 'GetUserNotes'],
      })
      .pipe(this.voidResponse());
  }
}