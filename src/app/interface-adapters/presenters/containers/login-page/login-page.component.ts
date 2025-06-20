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

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
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
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  passwordVisible = false;
  loginForm!: FormGroup;
  logoPath: string = '/twodo-logos/twodo-logo.svg';
  themeSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
  ) {
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.logoPath = theme.mode === 'dark'
        ? '/twodo-logos/twodo-dark-logo.svg'
        : '/twodo-logos/twodo-logo.svg';
    });
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Login attempt', email, password);
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
