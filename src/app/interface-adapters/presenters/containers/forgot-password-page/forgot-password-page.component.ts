import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ThemeService } from '../../../../core/services/theme.service';
import { ThemeSwitcherComponent } from '../../components/theme-switcher/theme-switcher.component';
import { Subscription } from 'rxjs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
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
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss']
})
export class ForgotPasswordPageComponent {

  form!: FormGroup;
  logoPath: string = 'assets/images/twodo-logos/twodo-logo.svg';
  themeSubscription: Subscription;
  isSendingEmail = false;

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

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

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

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}