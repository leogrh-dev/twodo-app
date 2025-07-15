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

export const RESEND_CONFIRMATION_EMAIL_MUTATION = gql`
  mutation ResendConfirmationEmail($input: ResendConfirmationEmailInput!) {
    resendConfirmationEmail(input: $input)
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input)
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`;

export const UPDATE_USER_ICON_MUTATION = gql`
  mutation UpdateUserIcon($input: UpdateUserIconInput!) {
    updateUserIcon(input: $input)
  }
`;

export const REMOVE_USER_ICON_MUTATION = gql`
  mutation RemoveUserIcon($currentUrl: String!) {
    removeUserIcon(currentUrl: $currentUrl)
  }
`;

export const GET_CURRENT_USER_QUERY = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      name
      email
      phone
      iconUrl
    }
  }
`;

export const VERIFY_PASSWORD_MUTATION = gql`
  mutation VerifyPassword($input: VerifyPasswordInput!) {
    verifyPassword(input: $input)
  }
`;

export const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdatePassword($input: UpdatePasswordInput!) {
    updatePassword(input: $input)
  }
`;