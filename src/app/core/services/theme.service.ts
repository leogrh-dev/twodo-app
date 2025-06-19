import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
  mode: ThemeMode;
  isSystemPreference: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'twodo-theme-preference';
  private readonly themeSubject = new BehaviorSubject<ThemeState>({
    mode: 'light',
    isSystemPreference: false
  });

  public readonly theme$: Observable<ThemeState> = this.themeSubject.asObservable();

  constructor() {
    this.initializeTheme();
    this.listenToSystemThemeChanges();
  }

  public switchTheme(mode: ThemeMode): void {
    const newState: ThemeState = {
      mode,
      isSystemPreference: false
    };

    this.applyTheme(newState);
    this.saveThemePreference(mode);
    this.themeSubject.next(newState);
  }

  public useSystemTheme(): void {
    const systemMode = this.getSystemThemePreference();
    const newState: ThemeState = {
      mode: systemMode,
      isSystemPreference: true
    };

    this.applyTheme(newState);
    this.clearThemePreference();
    this.themeSubject.next(newState);
  }

  public toggleTheme(): void {
    const currentMode = this.themeSubject.value.mode;
    const newMode: ThemeMode = currentMode === 'light' ? 'dark' : 'light';
    this.switchTheme(newMode);
  }

  public getCurrentTheme(): ThemeState {
    return this.themeSubject.value;
  }

  public isDarkMode(): boolean {
    return this.themeSubject.value.mode === 'dark';
  }

  private initializeTheme(): void {
    const savedTheme = this.getSavedThemePreference();
    
    if (savedTheme) {
      const state: ThemeState = {
        mode: savedTheme,
        isSystemPreference: false
      };
      this.applyTheme(state);
      this.themeSubject.next(state);
    } else {
      this.useSystemTheme();
    }
  }

  private applyTheme(themeState: ThemeState): void {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    htmlElement.classList.remove('theme-light', 'theme-dark');
    bodyElement.classList.remove('theme-light', 'theme-dark');

    const themeClass = `theme-${themeState.mode}`;
    htmlElement.classList.add(themeClass);
    bodyElement.classList.add(themeClass);

    htmlElement.style.setProperty('color-scheme', themeState.mode);

    this.updateMetaThemeColor(themeState.mode)
  }

  private updateMetaThemeColor(mode: ThemeMode): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const color = mode === 'dark' ? '#141414' : '#ffffff';
    
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    }
  }

  private getSystemThemePreference(): ThemeMode {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  private listenToSystemThemeChanges(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      mediaQuery.addEventListener('change', (e) => {
        if (this.themeSubject.value.isSystemPreference) {
          const newMode: ThemeMode = e.matches ? 'dark' : 'light';
          const newState: ThemeState = {
            mode: newMode,
            isSystemPreference: true
          };
          
          this.applyTheme(newState);
          this.themeSubject.next(newState);
        }
      });
    }
  }

  private saveThemePreference(mode: ThemeMode): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.THEME_STORAGE_KEY, mode);
    }
  }

  private getSavedThemePreference(): ThemeMode | null {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.THEME_STORAGE_KEY);
      return (saved === 'light' || saved === 'dark') ? saved : null;
    }
    return null;
  }

  private clearThemePreference(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.THEME_STORAGE_KEY);
    }
  }
}