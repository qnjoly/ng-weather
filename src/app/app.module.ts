import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { LocationService } from './shared/services/location.service';
import { WeatherService } from './shared/services/weather.service';
import { ForecastsListComponent } from './weather/forecasts-list/forecasts-list.component';
import { CurrentConditionsComponent } from './weather/main-page/components/current-conditions/current-conditions.component';
import { ZipcodeEntryComponent } from './weather/main-page/components/zipcode-entry/zipcode-entry.component';
import { MainPageComponent } from './weather/main-page/main-page.component';
import { LocationWeatherService } from './weather/services/location-weather.service';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
  ],
  providers: [LocationService, WeatherService, LocationWeatherService, provideHttpClient(withInterceptorsFromDi())],
})
export class AppModule {}
