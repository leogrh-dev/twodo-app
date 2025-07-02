import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { setContext } from '@apollo/client/link/context';
import { createHttpLink, InMemoryCache } from '@apollo/client/core';
import { provideApollo } from 'apollo-angular';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = createHttpLink({ uri: 'http://localhost:3000/graphql' });

      const authLink = setContext((_, { headers }) => {
        const token = localStorage.getItem('access_token');
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