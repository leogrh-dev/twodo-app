import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeStorageService {
  private readonly key = 'twodo-theme';

  save(theme: string): void {
    localStorage.setItem(this.key, theme);
  }

  load(): string | null {
    return localStorage.getItem(this.key);
  }
}
