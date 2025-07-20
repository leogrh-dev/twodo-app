import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { ThemeSwitcherComponent } from '../../components/theme-switcher/theme-switcher.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    ThemeSwitcherComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnDestroy {

  // ======================
  // Estados internos
  // ======================

  /** Formulário de login */
  loginForm!: FormGroup;

  /** Exibir ou ocultar senha */
  passwordVisible = false;

  /** Caminho do logo atual conforme o tema */
  logoPath = 'assets/images/twodo-logos/twodo-logo.svg';

  /** Indica se a requisição de login está em andamento */
  isLogging = false;

  /** Inscrição do tema para atualização de logo */
  private themeSubscription: Subscription;

  // ======================
  // Construtor e injeções
  // ======================

  constructor(
    private readonly fb: FormBuilder,
    private readonly themeService: ThemeService,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.logoPath = theme.mode === 'dark'
        ? 'assets/images/twodo-logos/twodo-dark-logo.svg'
        : 'assets/images/twodo-logos/twodo-logo.svg';
    });
  }

  // ======================
  // Ciclo de vida
  // ======================

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  // ======================
  // Ações do usuário
  // ======================

  /** Submete o formulário de login */
  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLogging = true;
    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login(email, password, rememberMe).subscribe({
      next: () => {
        this.isLogging = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLogging = false;
        console.error('Login failed:', err);
        alert('Email ou senha inválidos');
      },
    });
  }

  /** Realiza login com conta do Google */
  handleGoogleLogin(): void {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => {
        this.isLogging = true;
        const idToken = response.credential;

        this.authService.loginWithGoogle(idToken, true).subscribe({
          next: () => {
            this.isLogging = false;
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.isLogging = false;
            console.error('Erro no login com Google', err);
            alert('Erro no login com Google');
          },
        });
      },
      ux_mode: "popup"
    });

    // @ts-ignore
    google.accounts.id.prompt();
  }

  /** Alterna visibilidade do campo de senha */
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}