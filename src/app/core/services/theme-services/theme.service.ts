import { Injectable } from '@angular/core';
import { ThemeStorageService } from './theme-storage.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private currentTheme = 'default-theme';

  constructor(private storage: ThemeStorageService) {
    const savedTheme = this.storage.load();
    this.currentTheme = savedTheme || this.currentTheme;
    this.applyTheme(this.currentTheme);
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'default-theme' ? 'dark-theme' : 'default-theme';
    this.applyTheme(this.currentTheme);
    this.storage.save(this.currentTheme);
  }

  getTheme(): string {
    return this.currentTheme;
  }

  private applyTheme(theme: string) {
    document.body.classList.remove('default-theme', 'dark-theme');
    document.body.classList.add(theme);
  }
}