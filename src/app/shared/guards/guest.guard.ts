import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();

    if (isLoggedIn) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
