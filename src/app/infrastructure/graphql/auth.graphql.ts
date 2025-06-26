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