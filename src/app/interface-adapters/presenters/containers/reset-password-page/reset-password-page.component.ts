import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeSwitcherComponent } from '../../components/theme-switcher/theme-switcher.component';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../../core/services/theme.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeSwitcherComponent,
  ],
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.scss'],
})
export class ResetPasswordPageComponent implements OnInit {
  resetForm!: FormGroup;
  passwordVisible = false;
  passwordStrength = 0;
  passwordChecks = {
    length: false,
    letters: false,
    numbers: false,
    special: false,
  };

  token: string = '';
  logoPath: string = 'assets/images/twodo-logos/twodo-logo.svg';
  themeSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
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
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.notification.error('Token inválido', 'O link de redefinição está incompleto ou expirado.');
      this.router.navigate(['/login']);
    }

    this.resetForm = this.fb.group({
      password: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  checkPasswordStrength() {
    const value = this.resetForm.get('password')?.value || '';
    this.passwordChecks.length = value.length >= 10;
    this.passwordChecks.letters = /[a-zA-Z]/.test(value);
    this.passwordChecks.numbers = /[0-9]/.test(value);
    this.passwordChecks.special = /[^a-zA-Z0-9]/.test(value);

    this.passwordStrength = [
      this.passwordChecks.length,
      this.passwordChecks.letters,
      this.passwordChecks.numbers,
      this.passwordChecks.special,
    ].filter(Boolean).length;
  }

  onSubmit() {
    const valid = this.passwordStrength >= 3;
    if (!valid) {
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