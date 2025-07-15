import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmailPendingGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }

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