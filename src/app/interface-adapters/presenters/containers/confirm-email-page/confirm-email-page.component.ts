import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ThemeService } from '../../../../core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm-email-page',
  standalone: true,
  imports: [CommonModule, NzButtonModule],
  templateUrl: './confirm-email-page.component.html',
  styleUrls: ['./confirm-email-page.component.scss'],
})
export class ConfirmEmailPageComponent implements OnInit {
  loading = true;
  success: boolean | null = null;
  logoPath: string = 'assets/images/twodo-logos/twodo-logo.svg';
  themeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private notification: NzNotificationService,
    private router: Router,
    private themeService: ThemeService,
  ) {
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.logoPath = theme.mode === 'dark'
        ? 'assets/images/twodo-logos/twodo-dark-logo.svg'
        : 'assets/images/twodo-logos/twodo-logo.svg';
    });
  }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.confirmEmail(token).subscribe({
        next: (result: any) => {
          const success = result?.data?.confirmEmail;
          this.success = success;
          this.loading = false;

          if (success) {
            this.authService.removeToken();
            this.notification.success('Email confirmado!', 'Agora você pode fazer login.');
          } else {
            this.authService.removeToken();
            this.notification.error('Erro', 'Não foi possível confirmar seu email.');
          }
        },
        error: () => {
          this.success = false;
          this.loading = false;
          this.notification.error('Erro', 'Token inválido ou expirado.');
        },
      });
    } else {
      this.success = false;
      this.loading = false;
      this.notification.error('Erro', 'Token não encontrado.');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  contactSupport() {
    window.open(
      'https://mail.google.com/mail/?view=cm&to=suporte@twodo.com&su=Problema na confirmação de e-mail',
      '_blank'
    );
  }
}