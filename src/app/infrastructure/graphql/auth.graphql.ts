import gql from 'graphql-tag';

export const LOGIN_MUTATION = gql`
  mutation UserLogin($input: LoginInput!) {
    userLogin(input: $input) {
      accessToken
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation UserRegister($input: RegisterInput!) {
    userRegister(input: $input) {
      id
      name
      email
      phone
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

export const CONFIRM_EMAIL_MUTATION = gql`
  mutation ConfirmEmail($token: String!) {
    confirmEmail(token: $token)
  }
`;
