import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';

/**
 * EmailPendingGuard permite acesso apenas a usuários com e-mail ainda não verificado.
 */
@Injectable({ providedIn: 'root' })
export class EmailPendingGuard implements CanActivate {

  // ==============================
  // Construtor e Injeções
  // ==============================

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  // ==============================
  // Método principal de proteção
  // ==============================

  /**
   * Permite acesso apenas se o token estiver presente
   * e o e-mail do usuário ainda não estiver verificado.
   */
  async canActivate(): Promise<boolean> {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/']);
      return false;
    }

    try {
      const user = await firstValueFrom(this.authService.getCurrentUser());
      return !user.emailVerified;
    } catch {
      this.router.navigate(['/']);
      return false;
    }
  }
}