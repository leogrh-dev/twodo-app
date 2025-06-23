import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { LOGIN_MUTATION, LOGIN_WITH_GOOGLE_MUTATION, REGISTER_MUTATION } from '../../infrastructure/graphql/auth.graphql';

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

  register(name: string, email: string, phone: string, password: string): Observable<string> {
    return this.apollo.mutate({
      mutation: REGISTER_MUTATION,
      variables: { name, email, phone, password },
    }).pipe(
      map((result: any) => {
        const token = result?.data?.register?.token;
        if (token) {
          localStorage.setItem('auth_token', token);
          return token;
        }
        throw new Error('Register failed');
      })
    );
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
}
