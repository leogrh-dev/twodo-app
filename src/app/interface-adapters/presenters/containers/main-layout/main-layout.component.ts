import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { SidemenuComponent } from '../../components/sidemenu/sidemenu.component';
import { SidemenuResizerComponent } from '../../components/sidemenu-resizer/sidemenu-resizer.component';
import { MainToolbarComponent } from '../../components/main-toolbar/main-toolbar.component';

import { AuthService } from '../../../../core/services/auth.service';
import { UserStateService } from '../../../../core/services/user-state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    NzLayoutModule,
    NzMenuModule,
    SidemenuComponent,
    SidemenuResizerComponent,
    MainToolbarComponent,
  ],
})
export class MainLayoutComponent implements OnInit {
  // ==============================
  // Estado local
  // ==============================

  /** Indica se o sidemenu está colapsado */
  isCollapsed = false;

  /** Largura atual do sidemenu */
  sidemenuWidth = 280;

  // ==============================
  // Injeções
  // ==============================

  private readonly authService = inject(AuthService);
  private readonly userState = inject(UserStateService);
  private readonly destroyRef = inject(DestroyRef);

  // ==============================
  // Lifecycle
  // ==============================

  ngOnInit(): void {
    this.restoreSidemenuCollapseState();
    this.restoreSidemenuWidth();
    this.initializeCurrentUser();
  }

  // ==============================
  // Ações do layout
  // ==============================

  /** Alterna o estado de colapso do sidemenu */
  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('sidemenuCollapsed', String(this.isCollapsed));
  }

  /** Ajusta largura via redimensionador */
  onResizeSidemenu(newWidth: number): void {
    this.sidemenuWidth = newWidth;
    localStorage.setItem('sidemenuWidth', String(newWidth));
  }

  /** Clique simples no resizer → alterna colapso */
  onClickResizer(): void {
    this.toggleCollapse();
  }

  // ==============================
  // Métodos privados
  // ==============================

  /** Restaura colapso salvo no localStorage */
  private restoreSidemenuCollapseState(): void {
    const saved = localStorage.getItem('sidemenuCollapsed');
    this.isCollapsed = saved === 'true';
  }

  /** Restaura largura salva no localStorage */
  private restoreSidemenuWidth(): void {
    const saved = localStorage.getItem('sidemenuWidth');
    if (saved !== null) {
      const width = parseInt(saved, 10);
      this.sidemenuWidth = this.clamp(width, 240, 480);
    }
  }

  /** Carrega usuário atual no estado global */
  private initializeCurrentUser(): void {
    this.authService.getCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => this.userState.setUser(user));
  }

  /** Limita um valor entre min e max */
  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}