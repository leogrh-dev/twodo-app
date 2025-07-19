import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { ThemeSwitcherComponent } from '../../components/theme-switcher/theme-switcher.component';
import { PhoneInputWithDdiSelectorComponent } from '../../components/phone-input-with-ddi-selector/phone-input-with-ddi-selector.component';

import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  imports: [
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeSwitcherComponent,
    PhoneInputWithDdiSelectorComponent,
  ],
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  // ==============================
  // Estado do componente
  // ==============================

  /** Passo atual do formulário em 3 etapas */
  currentStep = 1;

  /** Formulário reativo principal */
  registerForm!: FormGroup;

  /** Visibilidade do campo de senha */
  passwordVisible = false;

  /** Caminho do logo conforme o tema */
  logoPath = 'assets/images/twodo-logos/twodo-logo.svg';

  /** Strength visual da senha (0‒4) */
  passwordStrength = 0;

  /** Flag de carregamento de registro */
  isRegistering = false;

  /** Checagens individuais da senha */
  passwordChecks = {
    length: false,
    letters: false,
    numbers: false,
    special: false,
  };

  // ==============================
  // Subscriptions
  // ==============================

  private themeSubscription!: Subscription;

  // ==============================
  // Injeções
  // ==============================

  constructor(
    private readonly fb: FormBuilder,
    private readonly themeService: ThemeService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notification: NzNotificationService,
  ) { }

  // ==============================
  // Lifecycle
  // ==============================

  ngOnInit(): void {
    this.initForm();
    this.watchTheme();
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  // ==============================
  // Inicialização
  // ==============================

  /** Define estrutura e validações do formulário */
  private initForm(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /** Observa alterações de tema para atualizar o logo */
  private watchTheme(): void {
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.logoPath = theme.mode === 'dark'
        ? 'assets/images/twodo-logos/twodo-dark-logo.svg'
        : 'assets/images/twodo-logos/twodo-logo.svg';
    });
  }

  // ==============================
  // Navegação entre passos
  // ==============================

  nextStep(): void {
    if (this.currentStep === 1 && this.registerForm.get('name')?.valid) {
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      const emailValid = this.registerForm.get('email')?.valid;
      const phoneValid = this.registerForm.get('phone')?.valid;

      if (emailValid && phoneValid) {
        this.currentStep = 3;
      } else {
        this.notification.warning(
          'Dados inválidos',
          'Verifique se o e‑mail e o telefone estão preenchidos corretamente.',
        );
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  // ==============================
  // Submissão e registro
  // ==============================

  onSubmit(): void {
    if (this.currentStep < 3) {
      this.nextStep();
      return;
    }
    this.handleRegistration();
  }

  /** Executa a chamada de criação de conta */
  private handleRegistration(): void {
    const isPasswordValid =
      [
        this.passwordChecks.length,
        this.passwordChecks.letters,
        this.passwordChecks.numbers,
        this.passwordChecks.special,
      ].filter(Boolean).length >= 3;

    if (!isPasswordValid) {
      this.notification.error(
        'Senha inválida',
        'Sua senha deve atender ao menos 3 dos 4 critérios de segurança.',
      );
      return;
    }

    if (!this.registerForm.valid) {
      this.notification.warning('Formulário inválido', 'Preencha todos os campos corretamente.');
      return;
    }

    this.isRegistering = true;
    const { name, email, phone, password } = this.registerForm.value;

    this.authService.register(name, email, phone, password).subscribe({
      next: () => {
        this.isRegistering = false;
        this.notification.success(
          'Cadastro realizado!',
          'Enviamos um link de confirmação para seu e‑mail.',
        );
        this.router.navigate(['/email-pending']);
      },
      error: err => {
        this.isRegistering = false;
        console.error('Erro no cadastro:', err);
        this.notification.error('Erro no cadastro', 'Ocorreu um erro ao criar sua conta.');
      },
    });
  }

  // ==============================
  // Utilidades da UI
  // ==============================

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  /** Avalia força e critérios da senha */
  checkPasswordStrength(): void {
    const password = this.registerForm.get('password')?.value || '';

    this.passwordChecks = {
      length: password.length >= 10,
      letters: /[a-zA-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
    };

    const passed = Object.values(this.passwordChecks).filter(Boolean).length;
    this.passwordStrength = passed; // 0‑4
  }

  /** Texto e descrição dinâmicos do cabeçalho */
  getHeaderContent(): { title: string; description: string } {
    const name = this.registerForm?.get('name')?.value || '';
    const steps = {
      1: { title: 'Vamos criar sua conta!', description: 'Como você quer ser chamado?' },
      2: { title: `Perfeito ${name}!`, description: 'Insira abaixo suas informações de contato' },
      3: { title: 'Estamos quase lá!', description: 'Escolha sua senha para acessar sua conta' },
    } as const;
    return steps[this.currentStep as 1 | 2 | 3];
  }

  /** Acesso rápido ao controle de telefone */
  get phoneControl(): FormControl {
    return this.registerForm.get('phone') as FormControl;
  }
}