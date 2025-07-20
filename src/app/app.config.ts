import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';

import { provideApollo } from 'apollo-angular';
import { createHttpLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

// ==============================
// Registro de locale (en-US)
// ==============================
registerLocaleData(en);

/**
 * Configuração principal da aplicação Angular
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // ==============================
    // Otimizações e animações
    // ==============================
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),

    // ==============================
    // Roteamento
    // ==============================
    provideRouter(routes),

    // ==============================
    // Internacionalização (NG Zorro)
    // ==============================
    provideNzI18n(en_US),

    // ==============================
    // Módulos e HTTP
    // ==============================
    importProvidersFrom(FormsModule),
    provideHttpClient(),

    // ==============================
    // Apollo GraphQL
    // ==============================
    provideApollo(() => {
      const httpLink = createHttpLink({
        uri: environment.graphqlUri,
      });

      const authLink = setContext((_, { headers }) => {
        const token =
          localStorage.getItem('access_token') ||
          sessionStorage.getItem('access_token');

        return {
          headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
          },
        };
      });

      return {
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
      };
    }),
  ],
};