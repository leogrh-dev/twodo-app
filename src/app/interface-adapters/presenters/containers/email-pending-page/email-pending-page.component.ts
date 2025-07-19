import { Component, OnDestroy } from '@angular/core';
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
  templateUrl: './email-pending-page.component.html',
  styleUrls: ['./email-pending-page.component.scss'],
  imports: [CommonModule, NzButtonModule],
})
export class EmailPendingPageComponent implements OnDestroy {
  // ==============================
  // Estado da interface
  // ==============================

  /** Caminho do logo conforme tema */
  logoPath: string = 'assets/images/twodo-logos/twodo-logo.svg';

  /** E-mail do usuário pendente */
  email: string = '';

  // ==============================
  // Subscriptions
  // ==============================

  private readonly themeSubscription: Subscription;
  private readonly userSubscription?: Subscription;

  // ==============================
  // Injeções
  // ==============================

  constructor(
    private readonly router: Router,
    private readonly themeService: ThemeService,
    private readonly authService: AuthService,
    private readonly notification: NzNotificationService,
  ) {
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.logoPath = theme.mode === 'dark'
        ? 'assets/images/twodo-logos/twodo-dark-logo.svg'
        : 'assets/images/twodo-logos/twodo-logo.svg';
    });

    this.userSubscription = this.authService.getCurrentUser().subscribe(user => {
      this.email = user?.email ?? '';
      this.authService.logout();
    });
  }

  // ==============================
  // Ações da interface
  // ==============================

  /** Redireciona para login */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /** Reenvia e-mail de verificação */
  resendEmail(): void {
    if (!this.email) {
      this.notification.error('Erro', 'E-mail do usuário não encontrado.');
      return;
    }

    this.notification.info('Reenviando e-mail', 'Aguarde enquanto processamos...');

    this.authService.resendConfirmationEmail(this.email).subscribe({
      next: () => {
        this.notification.success('E-mail reenviado', 'Verifique sua caixa de entrada.');
      },
      error: () => {
        this.notification.error('Erro', 'Não foi possível reenviar o e-mail.');
      },
    });
  }

  // ==============================
  // Lifecycle
  // ==============================

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
    this.userSubscription?.unsubscribe();
  }
}