// ======================
// Autenticação
// ======================

/** Resposta da mutation de login com e-mail e senha */
export interface LoginResponse {
  userLogin: {
    accessToken: string;
  };
}

/** Resposta da mutation de login com conta Google */
export interface LoginWithGoogleResponse {
  userLoginWithGoogle: {
    accessToken: string;
  };
}

/** Resposta da mutation de registro de novo usuário */
export interface RegisterResponse {
  userRegister: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

/** Resposta da mutation de confirmação de e-mail */
export interface ConfirmEmailResponse {
  confirmEmail: boolean;
}

/** Resposta da mutation de reenvio de e-mail de confirmação */
export interface ResendConfirmationEmailResponse {
  resendConfirmationEmail: boolean;
}

// ======================
// Senha
// ======================

/** Resposta da mutation de recuperação de senha */
export interface ForgotPasswordResponse {
  forgotPassword: boolean;
}

/** Resposta da mutation de redefinição de senha */
export interface ResetPasswordResponse {
  resetPassword: boolean;
}

/** Resposta da mutation de verificação da senha atual */
export interface VerifyPasswordResponse {
  verifyPassword: boolean;
}

/** Resposta da mutation de atualização da senha */
export interface UpdatePasswordResponse {
  updatePassword: boolean;
}

// ======================
// Perfil do usuário
// ======================

/** Resposta da mutation de atualização do nome do usuário */
export interface UpdateUserNameResponse {
  updateUserName: boolean;
}

/** Resposta da query que retorna o usuário autenticado */
export interface GetCurrentUserResponse {
  getCurrentUser: {
    id: string;
    name: string;
    email: string;
    phone: string;
    emailVerified: boolean;
    iconUrl?: string | null;
  };
}