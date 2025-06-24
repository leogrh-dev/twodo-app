import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { ThemeSwitcherComponent } from '../../components/theme-switcher/theme-switcher.component';
import { ThemeService } from '../../../../core/services/theme.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
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
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnDestroy {

  passwordVisible = false;
  loginForm!: FormGroup;
  logoPath: string = 'assets/images/twodo-logos/twodo-logo.svg';
  themeSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.logoPath = theme.mode === 'dark'
        ? 'assets/images/twodo-logos/twodo-dark-logo.svg'
        : 'assets/images/twodo-logos/twodo-logo.svg';
    });
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.value;
      this.authService.login(email, password, rememberMe).subscribe({
        next: (token) => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Email ou senha inválidos');
        },
      });
    }
  }

  handleGoogleLogin() {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => {
        const idToken = response.credential;
        this.authService.loginWithGoogle(idToken, true).subscribe({
          next: (token) => {
            this.router.navigate(['/']);
          },
          error: (err) => {
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

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
