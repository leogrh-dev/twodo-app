import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class EmailPendingGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    const user = this.authService.getCurrentUser();
    console.log("🚀 ~ EmailPendingGuard ~ canActivate ~ user:", user)

    if (token && user && !user.emailVerified) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}