import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeMode, ThemeService, ThemeState } from '../../../../core/services/theme.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
  ],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeSwitcherComponent {
  // ==============================
  // Estado reativo
  // ==============================

  /** Stream de finalização do componente */
  private readonly destroy$ = new Subject<void>();

  /** Estado atual do tema (observable) */
  public themeState$: Observable<ThemeState>;

  /** Tema atual (sincronizado com o observable) */
  public currentTheme: ThemeState = { mode: 'light', isSystemPreference: false };

  // ==============================
  // Construtor
  // ==============================

  constructor(private readonly themeService: ThemeService) {
    this.themeState$ = this.themeService.theme$;
  }

  // ==============================
  // Ciclo de vida
  // ==============================

  ngOnInit(): void {
    this.themeState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.currentTheme = state;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==============================
  // Ações de tema
  // ==============================

  /** Define um tema específico (claro ou escuro) */
  public onThemeSelect(mode: ThemeMode): void {
    this.themeService.switchTheme(mode);
  }

  /** Usa o tema do sistema operacional */
  public onSystemThemeSelect(): void {
    this.themeService.useSystemTheme();
  }

  /** Alterna rapidamente entre claro e escuro */
  public onQuickToggle(): void {
    this.themeService.toggleTheme();
  }

  /** Verifica se o tema está selecionado manualmente */
  public isThemeSelected(mode: ThemeMode): boolean {
    return this.currentTheme.mode === mode && !this.currentTheme.isSystemPreference;
  }

  /** Verifica se o tema do sistema está em uso */
  public isSystemThemeSelected(): boolean {
    return this.currentTheme.isSystemPreference;
  }
}