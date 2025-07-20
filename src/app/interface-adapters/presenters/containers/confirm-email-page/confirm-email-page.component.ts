import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-confirm-email-page',
  standalone: true,
  templateUrl: './confirm-email-page.component.html',
  styleUrls: ['./confirm-email-page.component.scss'],
  imports: [CommonModule, NzButtonModule],
})
export class ConfirmEmailPageComponent implements OnInit {
  // ==============================
  // Estado da página
  // ==============================

  /** Indica se a verificação está em andamento */
  loading = true;

  /** Resultado da verificação */
  success: boolean | null = null;

  /** Caminho do logo com base no tema */
  logoPath: string = 'assets/images/twodo-logos/twodo-logo.svg';

  /** Subscription para o tema */
  themeSubscription: Subscription;

  // ==============================
  // Construtor e injeções
  // ==============================

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

  // ==============================
  // Lifecycle
  // ==============================

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.authService.confirmEmail(token).subscribe({
        next: (success: boolean) => {
          this.success = success;
          this.loading = false;

          this.authService.logout();

          if (success) {
            this.notification.success('Email confirmado!', 'Agora você pode fazer login.');
          } else {
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

  // ==============================
  // Ações da interface
  // ==============================

  /** Redireciona para a tela de login */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /** Abre e-mail de suporte em nova aba */
  contactSupport(): void {
    window.open(
      'https://mail.google.com/mail/?view=cm&to=suporte@twodo.com&su=Problema na confirmação de e-mail',
      '_blank'
    );
  }
}