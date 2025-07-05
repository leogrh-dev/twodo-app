import { gql } from 'apollo-angular';

export const CREATE_NOTE_MUTATION = gql`
  mutation CreateNote {
    createNote {
      id
      title
      content
      ownerId
      bannerUrl
      createdAt
      updatedAt
    }
  }
`;

export const GET_NOTE_BY_ID_QUERY = gql`
  query GetNoteById($id: String!) {
    getNoteById(id: $id) {
      id
      title
      content
      bannerUrl
      createdAt
      updatedAt
      ownerId
    }
  }
`;

export const GET_USER_NOTES_QUERY = gql`
  query GetUserNotes {
    getUserNotes {
      id
      title
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