import { gql } from 'apollo-angular';

// ======================
// Queries
// ======================

/** Retorna nota pelo ID */
export const GET_NOTE_BY_ID_QUERY = gql`
  query getNoteById($id: String!) {
    getNoteById(id: $id) {
      id
      title
      content
      bannerUrl
      iconUrl
      createdAt
      updatedAt
      ownerId
      isDeleted
      isFavorite
    }
  }
`;

/** Retorna todas as notas ativas do usuário autenticado */
export const GET_USER_NOTES_QUERY = gql`
  query getUserNotes {
    getUserNotes {
      id
      title
      content
      ownerId
      bannerUrl
      iconUrl
      createdAt
      updatedAt
      isDeleted
      isFavorite
    }
  }
`;

/** Retorna as notas deletadas (lixeira) */
export const GET_DELETED_NOTES_QUERY = gql`
  query getDeletedNotes {
    getDeletedNotes {
      id
      title
      content
      ownerId
      bannerUrl
      iconUrl
      createdAt
      updatedAt
      isDeleted
      isFavorite
    }
  }
`;

// ======================
// Mutations
// ======================

/** Cria uma nova nota vazia */
export const CREATE_NOTE_MUTATION = gql`
  mutation createNote {
    createNote {
      id
      title
      content
      ownerId
      bannerUrl
      iconUrl
      createdAt
      updatedAt
      isDeleted
      isFavorite
    }
  }
`;

/** Atualiza o título da nota */
export const UPDATE_NOTE_TITLE_MUTATION = gql`
  mutation updateNoteTitle($input: UpdateNoteTitleInput!) {
    updateNoteTitle(input: $input) {
      id
      title
      updatedAt
    }
  }
`;

/** Atualiza o conteúdo da nota */
export const UPDATE_NOTE_CONTENT_MUTATION = gql`
  mutation updateNoteContent($input: UpdateNoteContentInput!) {
    updateNoteContent(input: $input) {
      id
      content
      updatedAt
    }
  }
`;

/** Atualiza a imagem/banner da nota */
export const UPDATE_NOTE_BANNER_MUTATION = gql`
  mutation updateNoteBanner($input: UpdateNoteBannerInput!) {
    updateNoteBanner(input: $input) {
      id
      bannerUrl
      updatedAt
    }
  }
`;

/** Remove o banner da nota */
export const REMOVE_NOTE_BANNER_MUTATION = gql`
  mutation removeNoteBanner($input: RemoveNoteBannerInput!) {
    removeNoteBanner(input: $input) {
      id
      bannerUrl
      updatedAt
    }
  }
`;

/** Atualiza o ícone da nota */
export const UPDATE_NOTE_ICON_MUTATION = gql`
  mutation updateNoteIcon($input: UpdateNoteIconInput!) {
    updateNoteIcon(input: $input) {
      id
      iconUrl
      updatedAt
    }
  }
`;

/** Remove o ícone da nota */
export const REMOVE_NOTE_ICON_MUTATION = gql`
  mutation removeNoteIcon($input: RemoveNoteIconInput!) {
    removeNoteIcon(input: $input) {
      id
      iconUrl
      updatedAt
    }
  }
`;

/** Move a nota para a lixeira (soft delete) */
export const SOFT_DELETE_NOTE_MUTATION = gql`
  mutation softDeleteNote($id: String!) {
    deleteNote(id: $id)
  }
`;

/** Restaura uma nota da lixeira */
export const RESTORE_NOTE_MUTATION = gql`
  mutation restoreNote($id: String!) {
    restoreNote(id: $id)
  }
`;

/** Deleta permanentemente uma nota */
export const PERMANENTLY_DELETE_NOTE_MUTATION = gql`
  mutation permanentlyDeleteNote($id: String!) {
    permanentlyDeleteNote(id: $id)
  }
`;

/** Alterna o status de favorito da nota */
export const TOGGLE_FAVORITE_NOTE_MUTATION = gql`
  mutation toggleFavoriteNote($id: String!) {
    toggleFavoriteNote(id: $id)
  }
`;