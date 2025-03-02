import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@env/environment';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { LocationService } from '@shared/services/location.service';
import { CONF_API_WEATHER, WeatherService } from '@shared/services/weather.service';
import { LocationWeatherService } from '@weather/services/location-weather.service';
import { CONF_CACHE, RequestCacheService } from '@shared/services/request-cache.service';
import { CacheApiInterceptor } from '@shared/interceptors/cache-api.interceptor';
import { PrettyMsPipe } from '@shared/pipes/pretty-ms.pipe';
import { ForecastsListComponent } from '@weather/features/forecasts-list/forecasts-list.component';
import { CurrentConditionsComponent } from '@weather/features/main-page/current-conditions/current-conditions.component';
import { MainPageComponent } from '@weather/features/main-page/main-page.component';
import { ZipcodeEntryComponent } from '@weather/features/main-page/zipcode-entry/zipcode-entry.component';

const provideInterceptors = () => {
  return [{ provide: HTTP_INTERCEPTORS, useClass: CacheApiInterceptor, multi: true }];
};

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PrettyMsPipe,
    routing,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
  ],
  providers: [
    LocationService,
    WeatherService,
    LocationWeatherService,
    RequestCacheService,
    provideHttpClient(withInterceptorsFromDi()),
    provideInterceptors(),
    { provide: CONF_API_WEATHER, useValue: environment.weather },
    { provide: CONF_CACHE, useValue: environment.cache },
  ],
})
export class AppModule {}
