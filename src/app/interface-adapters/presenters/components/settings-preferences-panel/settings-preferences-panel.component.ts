import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { ThemeService, ThemeState } from '../../../../core/services/theme.service';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-settings-preferences-panel',
  standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    NzRadioModule,
    NzSelectModule
  ],
  templateUrl: './settings-preferences-panel.component.html',
  styleUrls: ['./settings-preferences-panel.component.scss'],
})
export class SettingsPreferencesPanelComponent {
  private readonly themeService = inject(ThemeService);

  readonly selectedTheme = signal<'light' | 'dark' | 'system'>(this.resolveInitialTheme());
  readonly isSystemPreference = signal(this.themeService.getCurrentTheme().isSystemPreference);

  private resolveInitialTheme(): 'light' | 'dark' | 'system' {
    const themeState = this.themeService.getCurrentTheme();
    return themeState.isSystemPreference ? 'system' : themeState.mode;
  }

  onThemeChange(value: 'light' | 'dark' | 'system') {
    this.selectedTheme.set(value);
    this.isSystemPreference.set(value === 'system');

    if (value === 'system') {
      this.themeService.useSystemTheme();
    } else {
      this.themeService.switchTheme(value);
    }
  }

  resetToSystemTheme() {
    this.themeService.useSystemTheme();
    this.selectedTheme.set('system');
    this.isSystemPreference.set(true);
  }
}