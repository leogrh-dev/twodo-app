import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';

/**
 * AuthGuard protege rotas privadas verificando se há um token válido
 * e se o e-mail do usuário está confirmado.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

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
   * Impede o acesso à rota se o usuário não estiver autenticado
   * ou se o e-mail ainda não tiver sido verificado.
   */
  async canActivate(): Promise<boolean> {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const user = await firstValueFrom(this.authService.getCurrentUser());

      if (!user.emailVerified) {
        this.router.navigate(['/email-pending']);
        return false;
      }

      return true;
    } catch {
      this.router.navigate(['/login']);
      return false;
    }
  }
}