import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home-page/home-page.component').then(
        (m) => m.HomePageComponent
      ),
  },
  {
    path: 'detail/:dayId/:dayDate',
    loadComponent: () =>
      import('./pages/detail-page/detail-page.component').then(
        (m) => m.DetailPageComponent
      ),
  },
  {
    path: 'training/:dayId',
    loadComponent: () =>
      import('./pages/detail-page/detail-page.component').then(
        (m) => m.DetailPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
