import { gql } from 'apollo-angular';

// Queries
export const GET_NOTE_BY_ID_QUERY = gql`
  query GetNoteById($id: String!) {
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

export const GET_USER_NOTES_QUERY = gql`
  query GetUserNotes {
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

export const GET_DELETED_NOTES_QUERY = gql`
  query GetDeletedNotes {
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

// Mutations
export const CREATE_NOTE_MUTATION = gql`
  mutation CreateNote {
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

export const UPDATE_NOTE_TITLE_MUTATION = gql`
  mutation UpdateNoteTitle($input: UpdateNoteTitleInput!) {
    updateNoteTitle(input: $input) {
      id
      title
      updatedAt
    }
  }
`;

export const UPDATE_NOTE_CONTENT_MUTATION = gql`
  mutation UpdateNoteContent($input: UpdateNoteContentInput!) {
    updateNoteContent(input: $input) {
      id
      content
      updatedAt
    }
  }
`;

export const UPDATE_NOTE_BANNER_MUTATION = gql`
  mutation UpdateNoteBanner($input: UpdateNoteBannerInput!) {
    updateNoteBanner(input: $input) {
      id
      bannerUrl
      updatedAt
    }
  }
`;

export const REMOVE_NOTE_BANNER_MUTATION = gql`
  mutation RemoveNoteBanner($input: RemoveNoteBannerInput!) {
    removeNoteBanner(input: $input) {
      id
      bannerUrl
      updatedAt
    }
  }
`;

export const RESTORE_NOTE_MUTATION = gql`
  mutation RestoreNote($id: String!) {
    restoreNote(id: $id)
  }
`;

export const PERMANENTLY_DELETE_NOTE_MUTATION = gql`
  mutation PermanentlyDeleteNote($id: String!) {
    permanentlyDeleteNote(id: $id)
  }
`;

export const SOFT_DELETE_NOTE_MUTATION = gql`
  mutation SoftDeleteNote($id: String!) {
    deleteNote(id: $id)
  }
`;

export const TOGGLE_FAVORITE_NOTE_MUTATION = gql`
  mutation ToggleFavoriteNote($id: String!) {
    toggleFavoriteNote(id: $id)
  }
`;

export const UPDATE_NOTE_ICON_MUTATION = gql`
  mutation UpdateNoteIcon($input: UpdateNoteIconInput!) {
    updateNoteIcon(input: $input) {
      id
      iconUrl
      updatedAt
    }
  }
`;

export const REMOVE_NOTE_ICON_MUTATION = gql`
  mutation RemoveNoteIcon($input: RemoveNoteIconInput!) {
    removeNoteIcon(input: $input) {
      id
      iconUrl
      updatedAt
    }
  }
`;