import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-settings-preferences-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, NzRadioModule, NzSelectModule],
  templateUrl: './settings-preferences-panel.component.html',
  styleUrls: ['./settings-preferences-panel.component.scss'],
})
export class SettingsPreferencesPanelComponent {
  // ==============================
  // Injeções e sinais
  // ==============================

  private readonly themeService = inject(ThemeService);

  /** Tema selecionado atualmente */
  readonly selectedTheme = signal<'light' | 'dark' | 'system'>(this.resolveInitialTheme());

  /** Indica se o tema está seguindo a preferência do sistema */
  readonly isSystemPreference = signal(this.themeService.getCurrentTheme().isSystemPreference);

  // ==============================
  // Inicialização do tema
  // ==============================

  /** Resolve o tema inicial com base no estado salvo ou sistema */
  private resolveInitialTheme(): 'light' | 'dark' | 'system' {
    const themeState = this.themeService.getCurrentTheme();
    return themeState.isSystemPreference ? 'system' : themeState.mode;
  }

  // ==============================
  // Ações do usuário
  // ==============================

  /** Troca o tema selecionado (claro, escuro ou sistema) */
  onThemeChange(value: 'light' | 'dark' | 'system'): void {
    this.selectedTheme.set(value);
    this.isSystemPreference.set(value === 'system');

    if (value === 'system') {
      this.themeService.useSystemTheme();
    } else {
      this.themeService.switchTheme(value);
    }
  }

  /** Restaura o tema com base nas preferências do sistema operacional */
  resetToSystemTheme(): void {
    this.themeService.useSystemTheme();
    this.selectedTheme.set('system');
    this.isSystemPreference.set(true);
  }
}