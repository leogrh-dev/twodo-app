import gql from 'graphql-tag';

export const LOGIN_MUTATION = gql`
  mutation UserLogin($input: LoginInput!) {
    userLogin(input: $input) {
      accessToken
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation UserLogin($input: LoginInput!) {
    userLogin(input: $input) {
      accessToken
    }
  }
`;

export const LOGIN_WITH_GOOGLE_MUTATION = gql`
  mutation UserLoginWithGoogle($input: GoogleLoginInput!) {
    userLoginWithGoogle(input: $input) {
      accessToken
    }
  }
`;
