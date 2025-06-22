import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

import { provideApollo } from 'apollo-angular';
import { InMemoryCache, createHttpLink } from '@apollo/client/core';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    provideHttpClient(),

    provideApollo(() => ({
      link: createHttpLink({ uri: 'http://localhost:3000/graphql' }),
      cache: new InMemoryCache(),
    })),
  ],
};