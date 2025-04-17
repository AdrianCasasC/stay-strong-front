import { Routes } from '@angular/router';

export const DETAILS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/details-layout-page/details-layout-page.component').then(
        (m) => m.DetailsLayoutPageComponent
      ),
    children: [
      {
        path: 'list',
        loadComponent: () =>
          import('../pages/detail-page/detail-page.component').then(
            (m) => m.DetailPageComponent
          ),
      },
      {
        path: 'training',
        loadComponent: () =>
          import('../pages/training-page/training-page.component').then(
            (m) => m.TrainingPageComponent
          ),
      },
    ],
  },
];
