import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

/**
 * Protege a rota de redefinição de senha.
 * Redireciona para "/forgot-password" caso o token não esteja presente na URL.
 */
@Injectable({
  providedIn: 'root',
})
export class ResetPasswordTokenGuard implements CanActivate {
  // ==============================
  // Construtor e injeções
  // ==============================

  constructor(private readonly router: Router) { }

  // ==============================
  // Método principal
  // ==============================

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = route.queryParamMap.get('token');

    if (!token) {
      this.router.navigate(['/forgot-password']);
      return false;
    }

    return true;
  }
}