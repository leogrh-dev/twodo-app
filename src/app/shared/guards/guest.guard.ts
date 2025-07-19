import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/**
 * GuestGuard bloqueia acesso de usuários autenticados a páginas públicas (ex: login, registro).
 */
@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {

  // ==============================
  // Construtor e Injeções
  // ==============================

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  // ==============================
  // Método principal de proteção
  // ==============================

  /**
   * Permite acesso somente a usuários não autenticados (convidados).
   * Redireciona para '/' caso já esteja logado.
   */
  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();

    if (isLoggedIn) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}