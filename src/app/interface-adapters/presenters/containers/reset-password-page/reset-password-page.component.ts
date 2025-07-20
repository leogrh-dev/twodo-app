import { Component, OnInit, inject, DestroyRef, OnDestroy, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ThemeSwitcherComponent } from '../../components/theme-switcher/theme-switcher.component';
import { ThemeService } from '../../../../core/services/theme.service';
import { AuthService } from '../../../../core/services/auth.service';

/* ==============================
   Componente
============================== */

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    ThemeSwitcherComponent,
  ],
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.scss'],
})
export class ResetPasswordPageComponent implements OnInit, OnDestroy {

  /* ==============================
     Signals e Services
  =============================== */

  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  private readonly notification = inject(NzNotificationService);

  /* ==============================
     Propriedades de Estado
  =============================== */

  /** Formulário de redefinição de senha */
  resetForm!: FormGroup;

  /** Visibilidade do campo de senha */
  passwordVisible = false;

  /** Força da senha calculada dinamicamente */
  passwordStrength = 0;

  /** Checks de critérios da senha */
  passwordChecks = {
    length: false,
    letters: false,
    numbers: false,
    special: false,
  };

  /** Token de redefinição obtido da URL */
  token: string = '';

  /** Caminho do logo que muda conforme tema */
  logoPath: string = 'assets/images/twodo-logos/twodo-logo.svg';

  /* ==============================
     Ciclo de Vida
  =============================== */

  ngOnInit(): void {
    this.obterTokenDaURL();
    this.inicializarFormulario();
    this.ouvirTema();
  }

  ngOnDestroy(): void {

  }

  /* ==============================
     Inicialização
  =============================== */

  /** Lê o token da URL e redireciona se for inválido */
  private obterTokenDaURL(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.notification.error('Token inválido', 'O link de redefinição está incompleto ou expirado.');
      this.router.navigate(['/login']);
    }
  }

  /** Cria o form group com campo de senha obrigatório */
  private inicializarFormulario(): void {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required]],
    });
  }

  /** Atualiza o logo de acordo com o tema selecionado */
  private ouvirTema(): void {
    this.themeService.theme$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(theme => {
        this.logoPath = theme.mode === 'dark'
          ? 'assets/images/twodo-logos/twodo-dark-logo.svg'
          : 'assets/images/twodo-logos/twodo-logo.svg';
      });
  }

  /* ==============================
     Ações da Interface
  =============================== */

  /** Alterna visibilidade do campo de senha */
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  /** Calcula a força da senha com base nos critérios definidos */
  checkPasswordStrength(): void {
    const value = this.resetForm.get('password')?.value || '';
    this.passwordChecks.length = value.length >= 10;
    this.passwordChecks.letters = /[a-zA-Z]/.test(value);
    this.passwordChecks.numbers = /[0-9]/.test(value);
    this.passwordChecks.special = /[^a-zA-Z0-9]/.test(value);

    this.passwordStrength = Object.values(this.passwordChecks).filter(Boolean).length;
  }

  /** Envia o formulário de redefinição de senha após validação */
  onSubmit(): void {
    const senhaValida = this.passwordStrength >= 3;

    if (!senhaValida) {
      this.notification.error('Senha fraca', 'Sua senha deve atender ao menos 3 dos 4 critérios.');
      return;
    }

    if (this.resetForm.valid) {
      const password = this.resetForm.value.password;

      this.authService.resetPassword(this.token, password).subscribe({
        next: () => {
          this.notification.success('Sucesso!', 'Senha redefinida com sucesso.');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.notification.error('Erro', 'Não foi possível redefinir sua senha.');
        },
      });
    }
  }
}