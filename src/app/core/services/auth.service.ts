import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';

import {
  CONFIRM_EMAIL_MUTATION,
  FORGOT_PASSWORD_MUTATION,
  GET_CURRENT_USER_QUERY,
  LOGIN_MUTATION,
  LOGIN_WITH_GOOGLE_MUTATION,
  REGISTER_MUTATION,
  RESEND_CONFIRMATION_EMAIL_MUTATION,
  RESET_PASSWORD_MUTATION,
  UPDATE_PASSWORD_MUTATION,
  UPDATE_USER_NAME_MUTATION,
  VERIFY_PASSWORD_MUTATION
} from '../../infrastructure/graphql/auth.graphql';

import {
  LoginResponse,
  LoginWithGoogleResponse,
  RegisterResponse,
  ConfirmEmailResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  ResendConfirmationEmailResponse,
  GetCurrentUserResponse,
  UpdatePasswordResponse,
  VerifyPasswordResponse,
  UpdateUserNameResponse
} from '../../infrastructure/graphql/auth.graphql.types';

import { User } from '../entities/user.entity';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';

  constructor(private readonly apollo: Apollo) { }

  // ======================
  // Autenticação
  // ======================

  /** Realiza login com e-mail e senha */
  login(email: string, password: string, rememberMe: boolean): Observable<string> {
    return this.apollo.mutate<LoginResponse>({
      mutation: LOGIN_MUTATION,
      variables: { input: { email, password } },
    }).pipe(
      map(result => {
        const token = result.data?.userLogin?.accessToken;
        if (!token) throw new Error('Falha no login');
        this.saveToken(token, rememberMe);
        return token;
      })
    );
  }

  /** Realiza login com conta Google */
  loginWithGoogle(idToken: string, rememberMe: boolean): Observable<string> {
    return this.apollo.mutate<LoginWithGoogleResponse>({
      mutation: LOGIN_WITH_GOOGLE_MUTATION,
      variables: { input: { idToken } },
    }).pipe(
      map(result => {
        const token = result.data?.userLoginWithGoogle?.accessToken;
        if (!token) throw new Error('Falha no login com Google');
        this.saveToken(token, rememberMe);
        return token;
      })
    );
  }

  /** Registra novo usuário */
  register(
    name: string,
    email: string,
    phone: string,
    password: string
  ): Observable<RegisterResponse['userRegister']> {
    return this.apollo.mutate<RegisterResponse>({
      mutation: REGISTER_MUTATION,
      variables: { input: { name, email, phone, password } },
    }).pipe(
      map(result => {
        const user = result.data?.userRegister;
        if (!user) throw new Error('Falha no registro');
        return user;
      })
    );
  }

  /** Confirma o e-mail do usuário através do token */
  confirmEmail(token: string): Observable<boolean> {
    return this.apollo.mutate<ConfirmEmailResponse>({
      mutation: CONFIRM_EMAIL_MUTATION,
      variables: { token },
    }).pipe(
      map(result => result.data?.confirmEmail ?? false)
    );
  }

  // ======================
  // Recuperação de senha
  // ======================

  /** Solicita recuperação de senha por e-mail */
  forgotPassword(email: string): Observable<boolean> {
    return this.apollo.mutate<ForgotPasswordResponse>({
      mutation: FORGOT_PASSWORD_MUTATION,
      variables: { input: { email } },
    }).pipe(
      map(result => result.data?.forgotPassword ?? false)
    );
  }

  /** Redefine a senha com novo valor e token */
  resetPassword(token: string, newPassword: string): Observable<boolean> {
    return this.apollo.mutate<ResetPasswordResponse>({
      mutation: RESET_PASSWORD_MUTATION,
      variables: { input: { token, newPassword } },
    }).pipe(
      map(result => result.data?.resetPassword ?? false)
    );
  }

  /** Reenvia e-mail de confirmação de conta */
  resendConfirmationEmail(email: string): Observable<boolean> {
    return this.apollo.mutate<ResendConfirmationEmailResponse>({
      mutation: RESEND_CONFIRMATION_EMAIL_MUTATION,
      variables: { input: { email } },
    }).pipe(
      map(result => result.data?.resendConfirmationEmail ?? false)
    );
  }

  /** Atualiza a senha do usuário autenticado */
  updatePassword(newPassword: string): Observable<boolean> {
    return this.apollo.mutate<UpdatePasswordResponse>({
      mutation: UPDATE_PASSWORD_MUTATION,
      variables: { input: { newPassword } },
    }).pipe(
      map(result => result.data?.updatePassword ?? false)
    );
  }

  /** Verifica se a senha atual está correta */
  verifyPassword(password: string): Observable<boolean> {
    return this.apollo.mutate<VerifyPasswordResponse>({
      mutation: VERIFY_PASSWORD_MUTATION,
      variables: { input: { password } },
    }).pipe(
      map(result => result.data?.verifyPassword ?? false)
    );
  }

  // ======================
  // Dados do usuário
  // ======================

  /** Atualiza o nome do usuário logado */
  updateUserName(newName: string): Observable<boolean> {
    return this.apollo.mutate<UpdateUserNameResponse>({
      mutation: UPDATE_USER_NAME_MUTATION,
      variables: { input: { newName } },
    }).pipe(
      map(result => result.data?.updateUserName ?? false)
    );
  }

  /** Retorna os dados do usuário autenticado */
  getCurrentUser(): Observable<User> {
    return this.apollo.query<GetCurrentUserResponse>({
      query: GET_CURRENT_USER_QUERY,
      fetchPolicy: 'no-cache',
    }).pipe(
      map(result => {
        const user = result.data?.getCurrentUser;
        if (!user) throw new Error('Usuário não encontrado');
        return new User(
          user.id,
          user.name,
          user.email,
          user.phone,
          user.emailVerified,
          user.iconUrl ?? null
        );
      })
    );
  }

  // ======================
  // Token e sessão
  // ======================

  /** Retorna se o usuário está autenticado */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** Retorna o token atual armazenado */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  /** Finaliza a sessão do usuário */
  logout(): void {
    this.removeToken();
  }

  /** Armazena o token de acesso */
  private saveToken(token: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /** Remove o token de sessão */
  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }
}