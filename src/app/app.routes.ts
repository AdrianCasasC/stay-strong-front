import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home-page/home-page.component').then(
        (m) => m.HomePageComponent
      ),
  },
  // {
  //   path: 'detail/:dayId/:dayDate',
  //   loadComponent: () =>
  //     import('./pages/detail-page/detail-page.component').then(
  //       (m) => m.DetailPageComponent
  //     ),
  // },
  // {
  //   path: 'training/:dayId',
  //   loadComponent: () =>
  //     import('./pages/training-page/training-page.component').then(
  //       (m) => m.TrainingPageComponent
  //     ),
  // },
  {
    path: 'details',
    loadChildren: () =>
      import('./routes/detail.routes').then((m) => m.DETAILS_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
