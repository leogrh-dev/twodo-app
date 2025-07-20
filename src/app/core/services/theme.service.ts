import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
  mode: ThemeMode;
  isSystemPreference: boolean;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'twodo-theme-preference';

  private readonly themeSubject = new BehaviorSubject<ThemeState>({
    mode: 'light',
    isSystemPreference: false,
  });

  readonly theme$: Observable<ThemeState> = this.themeSubject.asObservable();

  constructor() {
    this.initializeTheme();
    this.listenToSystemThemeChanges();
  }

  // ======================
  // Ações públicas
  // ======================

  /** Alterna entre light e dark manualmente */
  switchTheme(mode: ThemeMode): void {
    const state: ThemeState = { mode, isSystemPreference: false };
    this.applyTheme(state);
    this.saveThemePreference(mode);
    this.themeSubject.next(state);
  }

  /** Usa o tema do sistema operacional */
  useSystemTheme(): void {
    const systemMode = this.getSystemThemePreference();
    const state: ThemeState = { mode: systemMode, isSystemPreference: true };
    this.applyTheme(state);
    this.clearThemePreference();
    this.themeSubject.next(state);
  }

  /** Alterna entre light e dark com base no estado atual */
  toggleTheme(): void {
    const current = this.themeSubject.value.mode;
    const next: ThemeMode = current === 'light' ? 'dark' : 'light';
    this.switchTheme(next);
  }

  /** Retorna o estado atual do tema */
  getCurrentTheme(): ThemeState {
    return this.themeSubject.value;
  }

  /** Indica se o tema atual é escuro */
  isDarkMode(): boolean {
    return this.getCurrentTheme().mode === 'dark';
  }

  // ======================
  // Inicialização
  // ======================

  private initializeTheme(): void {
    const saved = this.getSavedThemePreference();

    if (saved) {
      const state: ThemeState = { mode: saved, isSystemPreference: false };
      this.applyTheme(state);
      this.themeSubject.next(state);
    } else {
      this.useSystemTheme();
    }
  }

  // ======================
  // Aplicação visual do tema
  // ======================

  private applyTheme(state: ThemeState): void {
    const html = document.documentElement;
    const body = document.body;
    const className = `theme-${state.mode}`;

    html.classList.remove('theme-light', 'theme-dark');
    body.classList.remove('theme-light', 'theme-dark');

    html.classList.add(className);
    body.classList.add(className);

    html.style.setProperty('color-scheme', state.mode);
    this.updateMetaThemeColor(state.mode);
  }

  private updateMetaThemeColor(mode: ThemeMode): void {
    const meta = document.querySelector('meta[name="theme-color"]');
    const color = mode === 'dark' ? '#141414' : '#ffffff';
    meta?.setAttribute('content', color);
  }

  // ======================
  // Preferências do sistema
  // ======================

  private getSystemThemePreference(): ThemeMode {
    return window?.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private listenToSystemThemeChanges(): void {
    const mediaQuery = window?.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mediaQuery) return;

    mediaQuery.addEventListener('change', (e) => {
      if (this.themeSubject.value.isSystemPreference) {
        const newMode: ThemeMode = e.matches ? 'dark' : 'light';
        const newState: ThemeState = { mode: newMode, isSystemPreference: true };
        this.applyTheme(newState);
        this.themeSubject.next(newState);
      }
    });
  }

  // ======================
  // Armazenamento local
  // ======================

  private saveThemePreference(mode: ThemeMode): void {
    localStorage?.setItem(this.THEME_STORAGE_KEY, mode);
  }

  private getSavedThemePreference(): ThemeMode | null {
    const saved = localStorage?.getItem(this.THEME_STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : null;
  }

  private clearThemePreference(): void {
    localStorage?.removeItem(this.THEME_STORAGE_KEY);
  }
}