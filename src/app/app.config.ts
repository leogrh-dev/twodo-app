import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';

const CustomPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e6f2ff',
      100: '#b3daff',
      200: '#80c2ff',
      300: '#4daaff',
      400: '#0267FF',
      500: '#0255e6',
      600: '#0243cc',
      700: '#0131b3',
      800: '#011f99',
      900: '#010d80',
      950: '#000a66',
    }
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: CustomPreset
      }
    })
  ]
};