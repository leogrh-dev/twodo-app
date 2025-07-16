import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { CONFIRM_EMAIL_MUTATION, FORGOT_PASSWORD_MUTATION, GET_CURRENT_USER_QUERY, LOGIN_MUTATION, LOGIN_WITH_GOOGLE_MUTATION, REGISTER_MUTATION, RESEND_CONFIRMATION_EMAIL_MUTATION, RESET_PASSWORD_MUTATION, UPDATE_PASSWORD_MUTATION, UPDATE_USER_NAME_MUTATION, VERIFY_PASSWORD_MUTATION } from '../../infrastructure/graphql/auth.graphql';
import { User } from '../entities/user.entity';

interface DecodedToken {
  userId: string;
  name: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  iconUrl?: string | null;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';

  constructor(private apollo: Apollo) { }

  login(email: string, password: string, rememberMe: boolean): Observable<string> {
    return this.apollo
      .mutate({
        mutation: LOGIN_MUTATION,
        variables: {
          input: { email, password },
        },
      })
      .pipe(
        map((result: any) => {
          const token = result?.data?.userLogin?.accessToken;
          if (token) {
            this.saveToken(token, rememberMe);
          }
          return token;
        })
      );
  }

  loginWithGoogle(idToken: string, rememberMe: boolean): Observable<string> {
    return this.apollo
      .mutate({
        mutation: LOGIN_WITH_GOOGLE_MUTATION,
        variables: {
          input: { idToken },
        },
      })
      .pipe(
        map((result: any) => {
          const token = result?.data?.userLoginWithGoogle?.accessToken;
          if (token) {
            this.saveToken(token, rememberMe);
          }
          return token;
        })
      );
  }

  register(name: string, email: string, phone: string, password: string): Observable<{ id: string; name: string; email: string; phone: string }> {
    return this.apollo.mutate({
      mutation: REGISTER_MUTATION,
      variables: {
        input: { name, email, phone, password },
      },
    }).pipe(
      map((result: any) => {
        const user = result?.data?.userRegister;
        if (user) {
          return user;
        }
        throw new Error('Register failed');
      })
    );
  }

  confirmEmail(token: string) {
    return this.apollo.mutate({
      mutation: CONFIRM_EMAIL_MUTATION,
      variables: { token },
    });
  }

  saveToken(token: string, rememberMe: boolean) {
    if (rememberMe) {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  logout() {
    this.removeToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  resetPassword(token: string, newPassword: string): Observable<boolean> {
    return this.apollo
      .mutate({
        mutation: RESET_PASSWORD_MUTATION,
        variables: {
          input: {
            token,
            newPassword,
          },
        },
      })
      .pipe(map((result: any) => result?.data?.resetPassword));
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.apollo.mutate({
      mutation: FORGOT_PASSWORD_MUTATION,
      variables: {
        input: { email },
      },
    }).pipe(
      map((result: any) => result?.data?.forgotPassword)
    );
  }

  resendConfirmationEmail(email: string): Observable<boolean> {
    return this.apollo
      .mutate({
        mutation: RESEND_CONFIRMATION_EMAIL_MUTATION,
        variables: {
          input: { email },
        },
      })
      .pipe(map((result: any) => result?.data?.resendConfirmationEmail));
  }

  getCurrentUser(): Observable<User> {
    return this.apollo
      .query({
        query: GET_CURRENT_USER_QUERY,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map((result: any) => {
          const user = result?.data?.getCurrentUser;
          if (!user) throw new Error('Usuário não encontrado');
          return new User(
            user.id,
            user.name,
            user.email,
            user.phone,
            true,
            user.iconUrl ?? null
          );
        })
      );
  }

  updatePassword(newPassword: string): Observable<boolean> {
    return this.apollo.mutate({
      mutation: UPDATE_PASSWORD_MUTATION,
      variables: { input: { newPassword } },
    }).pipe(map((result: any) => result?.data?.updatePassword));
  }

  verifyPassword(password: string): Observable<boolean> {
    return this.apollo.mutate({
      mutation: VERIFY_PASSWORD_MUTATION,
      variables: { input: { password } }
    }).pipe(map((result: any) => result?.data?.verifyPassword));
  }

  updateUserName(newName: string): Observable<boolean> {
    return this.apollo.mutate({
      mutation: UPDATE_USER_NAME_MUTATION,
      variables: { input: { newName } },
    }).pipe(map((result: any) => result?.data?.updateUserName));
  }
}