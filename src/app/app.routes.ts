import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { EmailPendingGuard } from './shared/guards/email-pending.guard';
import { LoginPageComponent } from './interface-adapters/presenters/containers/login-page/login-page.component';
import { RegisterPageComponent } from './interface-adapters/presenters/containers/register-page/register-page.component';
import { EmailPendingPageComponent } from './interface-adapters/presenters/containers/email-pending-page/email-pending-page.component';
import { ConfirmEmailPageComponent } from './interface-adapters/presenters/containers/confirm-email-page/confirm-email-page.component';
import { ForgotPasswordPageComponent } from './interface-adapters/presenters/containers/forgot-password-page/forgot-password-page.component';
import { ResetPasswordPageComponent } from './interface-adapters/presenters/containers/reset-password-page/reset-password-page.component';
import { GuestGuard } from './shared/guards/guest.guard';
import { ResetPasswordTokenGuard } from './shared/guards/reset-password-token.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'email-pending',
    component: EmailPendingPageComponent,
    canActivate: [EmailPendingGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordPageComponent,
    canActivate: [GuestGuard, ResetPasswordTokenGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordPageComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'confirm-email',
    component: ConfirmEmailPageComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./interface-adapters/presenters/containers/main-layout/main-layout.routes')
        .then((m) => m.mainLayoutRoutes),
  },
];