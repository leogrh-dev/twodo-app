import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../../core/services/theme.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-email-pending-page',
  standalone: true,
  imports: [CommonModule, NzButtonModule],
  templateUrl: './email-pending-page.component.html',
  styleUrls: ['./email-pending-page.component.scss'],
})
export class EmailPendingPageComponent {
  logoPath: string = 'assets/images/twodo-logos/twodo-logo.svg';
  themeSubscription: Subscription;
  email: string = '';
  user: any;

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private authService: AuthService,
    private notification: NzNotificationService,
  ) {
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.logoPath = theme.mode === 'dark'
        ? 'assets/images/twodo-logos/twodo-dark-logo.svg'
        : 'assets/images/twodo-logos/twodo-logo.svg';
    });
    this.user = this.authService.getCurrentUser();
    this.authService.logout();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  resendEmail() {
    this.notification.info('Reenviando e-mail', 'Aguarde enquanto processamos.');

    if (this.user?.email) {
      this.authService.resendConfirmationEmail(this.user.email).subscribe({
        next: () => {
          this.notification.success('E-mail reenviado', 'Verifique sua caixa de entrada.');
        },
        error: () => {
          this.notification.error('Erro', 'Não foi possível reenviar o e-mail.');
        },
      });
    } else {
      this.notification.error('Erro', 'E-mail do usuário não encontrado.');
    }
  }
}
