import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForecastsListComponent } from './weather/forecasts-list/forecasts-list.component';
import { MainPageComponent } from './weather/main-page/main-page.component';

const appRoutes: Routes = [
  {
    path: '',
    component: MainPageComponent,
  },
  {
    path: 'forecast/:zipcode',
    component: ForecastsListComponent,
  },
];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes, { bindToComponentInputs: true });
