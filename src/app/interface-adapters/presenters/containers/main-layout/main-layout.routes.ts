import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { NoteAccessGuard } from '../../../../shared/guards/note-access.guard';

export const mainLayoutRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('../home-page/home-page.component').then(m => m.HomePageComponent),
      },
      {
        path: 'note/:id',
        canActivate: [NoteAccessGuard],
        loadComponent: () =>
          import('../note-page/note-page.component').then(m => m.NotePageComponent),
      },
    ],
  },
];