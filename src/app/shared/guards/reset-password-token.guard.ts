import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordTokenGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = route.queryParamMap.get('token');

    if (!token) {
      this.router.navigate(['/forgot-password']);
      return false;
    }

    return true;
  }
}