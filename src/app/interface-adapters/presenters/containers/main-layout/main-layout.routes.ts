
import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';

export const mainLayoutRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('../home-page/home-page.component').then(m => m.HomePageComponent),
      },
    ]
  }
];
