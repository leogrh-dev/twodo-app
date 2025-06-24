import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { ThemeSwitcherComponent } from '../../components/theme-switcher/theme-switcher.component';
import { PhoneInputWithDdiSelectorComponent } from '../../components/phone-input-with-ddi-selector/phone-input-with-ddi-selector.component';

import { ThemeService } from '../../../../core/services/theme.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
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
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent implements OnDestroy {

  currentStep = 1;
  registerForm!: FormGroup;
  passwordVisible = false;
  logoPath: string = 'assets/images/twodo-logos/twodo-logo.svg';
  themeSubscription: Subscription;
  passwordStrength = 0;

  passwordChecks = {
    length: false,
    letters: false,
    numbers: false,
    special: false,
  };

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router,
    private notification: NzNotificationService
  ) {
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.logoPath = theme.mode === 'dark'
        ? 'assets/images/twodo-logos/twodo-dark-logo.svg'
        : 'assets/images/twodo-logos/twodo-logo.svg';
    });
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  nextStep() {
    if (this.currentStep === 1) {
      const nameControl = this.registerForm.get('name');
      if (nameControl?.valid) {
        this.currentStep = 2;
      } else {
        this.notification.warning('Dados inválidos', 'O nome deve ter entre 2 e 50 caracteres.');
      }
    }
    else if (this.currentStep === 2) {
      const emailControl = this.registerForm.get('email');
      const phoneControl = this.registerForm.get('phone');

      if (emailControl?.valid && phoneControl?.valid) {
        this.currentStep = 3;
      } else {
        this.notification.warning(
          'Dados inválidos',
          'Verifique se o e-mail e o telefone estão preenchidos corretamente.'
        );
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit() {
    const isPasswordValid = [
      this.passwordChecks.length,
      this.passwordChecks.letters,
      this.passwordChecks.numbers,
      this.passwordChecks.special,
    ].filter(Boolean).length >= 3;

    if (!isPasswordValid) {
      this.notification.error(
        'Senha inválida',
        'Sua senha deve atender ao menos 3 dos 4 critérios de segurança.'
      );
      return;
    }

    if (this.registerForm.valid) {
      const { name, email, phone, password } = this.registerForm.value;

      this.authService.register(name, email, phone, password).subscribe({
        next: () => {
          this.notification.success(
            'Cadastro realizado!',
            'Enviamos um link de confirmação para seu e-mail.'
          );
          this.router.navigate(['/email-pending']);
        },
        error: (err) => {
          console.error('Erro no cadastro:', err);
          this.notification.error(
            'Erro no cadastro',
            'Ocorreu um erro ao tentar criar sua conta.'
          );
        },
      });
    } else {
      this.notification.warning(
        'Formulário inválido',
        'Preencha todos os campos corretamente.'
      );
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

  getHeaderContent(): { title: string; description: string } {
    const name = this.registerForm?.get('name')?.value || '';

    const stepContent: Record<number, { title: string; description: string }> = {
      1: {
        title: 'Vamos criar sua conta!',
        description: 'Como você quer ser chamado?',
      },
      2: {
        title: `Perfeito ${name}!`,
        description: 'Insira abaixo suas informações de contato',
      },
      3: {
        title: 'Estamos quase lá!',
        description: 'Escolha sua senha para acessar sua conta',
      },
    };

    return stepContent[this.currentStep] || { title: '', description: '' };
  }

  get phoneControl(): FormControl {
    return this.registerForm.get('phone') as FormControl;
  }

  checkPasswordStrength() {
    const password = this.registerForm.get('password')?.value || '';

    this.passwordChecks = {
      length: password.length >= 10,
      letters: /[a-zA-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
    };

    const { length, letters, numbers, special } = this.passwordChecks;

    const passedChecks = [length, letters, numbers, special].filter(Boolean).length;

    if (passedChecks === 0) {
      this.passwordStrength = 0;
    } else if (passedChecks === 1) {
      this.passwordStrength = 1;
    } else if (passedChecks === 2) {
      this.passwordStrength = 2;
    } else if (passedChecks === 3) {
      this.passwordStrength = 3;
    } else if (passedChecks === 4) {
      this.passwordStrength = 4;
    }
  }
}