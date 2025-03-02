import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@weather/features/main-page/main-page.component').then((m) => m.MainPageComponent),
  },
  {
    path: 'forecast/:zipcode',
    loadComponent: () =>
      import('@weather/features/forecasts-list/forecasts-list.component').then((m) => m.ForecastsListComponent),
  },
];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes, { bindToComponentInputs: true });
