import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { LoginPageComponent } from './interface-adapters/presenters/containers/login-page/login-page.component';
import { RegisterPageComponent } from './interface-adapters/presenters/containers/register-page/register-page.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
    {
    path: 'register',
    component: RegisterPageComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./interface-adapters/presenters/containers/main-layout/main-layout.routes')
        .then((m) => m.mainLayoutRoutes),
  },
];
