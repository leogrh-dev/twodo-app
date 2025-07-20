import gql from 'graphql-tag';

// ======================
// Mutations de autenticação
// ======================

/** Realiza login com e-mail e senha */
export const LOGIN_MUTATION = gql`
  mutation login($input: LoginInput!) {
    userLogin(input: $input) {
      accessToken
    }
  }
`;

/** Realiza login via conta Google */
export const LOGIN_WITH_GOOGLE_MUTATION = gql`
  mutation loginWithGoogle($input: GoogleLoginInput!) {
    userLoginWithGoogle(input: $input) {
      accessToken
    }
  }
`;

/** Registra novo usuário */
export const REGISTER_MUTATION = gql`
  mutation register($input: RegisterInput!) {
    userRegister(input: $input) {
      id
      name
      email
      phone
    }
  }
`;

/** Confirma o e-mail do usuário através do token */
export const CONFIRM_EMAIL_MUTATION = gql`
  mutation confirmEmail($token: String!) {
    confirmEmail(token: $token)
  }
`;

/** Reenvia o e-mail de confirmação */
export const RESEND_CONFIRMATION_EMAIL_MUTATION = gql`
  mutation resendConfirmationEmail($input: ResendConfirmationEmailInput!) {
    resendConfirmationEmail(input: $input)
  }
`;

// ======================
// Mutations de senha
// ======================

/** Solicita redefinição de senha (esqueci minha senha) */
export const FORGOT_PASSWORD_MUTATION = gql`
  mutation forgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input)
  }
`;

/** Redefine a senha com token */
export const RESET_PASSWORD_MUTATION = gql`
  mutation resetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`;

/** Verifica se a senha atual está correta */
export const VERIFY_PASSWORD_MUTATION = gql`
  mutation verifyPassword($input: VerifyPasswordInput!) {
    verifyPassword(input: $input)
  }
`;

/** Atualiza a senha do usuário */
export const UPDATE_PASSWORD_MUTATION = gql`
  mutation updatePassword($input: UpdatePasswordInput!) {
    updatePassword(input: $input)
  }
`;

// ======================
// Mutations de perfil
// ======================

/** Atualiza o nome do usuário */
export const UPDATE_USER_NAME_MUTATION = gql`
  mutation updateUserName($input: UpdateUserNameInput!) {
    updateUserName(input: $input)
  }
`;

/** Atualiza o ícone de perfil do usuário */
export const UPDATE_USER_ICON_MUTATION = gql`
  mutation updateUserIcon($input: UpdateUserIconInput!) {
    updateUserIcon(input: $input)
  }
`;

/** Remove o ícone de perfil do usuário */
export const REMOVE_USER_ICON_MUTATION = gql`
  mutation removeUserIcon($currentUrl: String!) {
    removeUserIcon(currentUrl: $currentUrl)
  }
`;

/** Exclui a conta do usuário */
export const DELETE_ACCOUNT_MUTATION = gql`
  mutation deleteAccount($input: DeleteAccountInput!) {
    deleteAccount(input: $input)
  }
`;

// ======================
// Queries
// ======================

/** Retorna os dados do usuário autenticado */
export const GET_CURRENT_USER_QUERY = gql`
  query getCurrentUser {
    getCurrentUser {
      id
      name
      email
      phone
      iconUrl
      emailVerified
    }
  }
`;
