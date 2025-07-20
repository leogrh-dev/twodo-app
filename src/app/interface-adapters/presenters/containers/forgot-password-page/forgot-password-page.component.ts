import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { ThemeSwitcherComponent } from '../../components/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss'],
  imports: [
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeSwitcherComponent,
  ],
})
export class ForgotPasswordPageComponent implements OnInit, OnDestroy {
  // ==============================
  // Estado da interface
  // ==============================

  /** Formulário de recuperação de senha */
  form!: FormGroup;

  /** Caminho dinâmico do logo */
  logoPath: string = 'assets/images/twodo-logos/twodo-logo.svg';

  /** Flag de carregamento */
  isSendingEmail = false;

  // ==============================
  // Subscriptions
  // ==============================

  private themeSubscription!: Subscription;

  // ==============================
  // Injeções
  // ==============================

  constructor(
    private fb: FormBuilder,
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
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  // ==============================
  // Ações da interface
  // ==============================

  /** Envia o formulário de recuperação de senha */
  onSubmit(): void {
    if (this.form.invalid) {
      this.notification.warning('Email inválido', 'Por favor, insira um email válido.');
      return;
    }

    this.isSendingEmail = true;
    const email = this.form.value.email!;

    this.authService.forgotPassword(email).subscribe({
      next: (success) => {
        this.isSendingEmail = false;
        if (success) {
          this.notification.success('Email enviado', 'Verifique sua caixa de entrada.');
        } else {
          this.notification.error('Erro', 'Não foi possível enviar o email.');
        }
      },
      error: () => {
        this.isSendingEmail = false;
        this.notification.error('Erro', 'Não foi possível enviar o email.');
      }
    });
  }
}