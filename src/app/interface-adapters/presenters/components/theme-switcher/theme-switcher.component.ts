import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeMode, ThemeService, ThemeState } from '../../../../core/services/theme.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-theme-switcher',
  imports: [
    CommonModule,
    NzButtonModule,
  ],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeSwitcherComponent {
  private readonly destroy$ = new Subject<void>();

  public themeState$: Observable<ThemeState>;
  public currentTheme: ThemeState = { mode: 'light', isSystemPreference: false };

  constructor(private readonly themeService: ThemeService) {
    this.themeState$ = this.themeService.theme$;
  }

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

  public onThemeSelect(mode: ThemeMode): void {
    this.themeService.switchTheme(mode);
  }

  public onSystemThemeSelect(): void {
    this.themeService.useSystemTheme();
  }

  public onQuickToggle(): void {
    this.themeService.toggleTheme();
  }

  public getThemeLabel(mode: ThemeMode): string {
    const labels = {
      light: 'Claro',
      dark: 'Escuro'
    };
    return labels[mode];
  }

  public isThemeSelected(mode: ThemeMode): boolean {
    return this.currentTheme.mode === mode && !this.currentTheme.isSystemPreference;
  }

  public isSystemThemeSelected(): boolean {
    return this.currentTheme.isSystemPreference;
  }
}
