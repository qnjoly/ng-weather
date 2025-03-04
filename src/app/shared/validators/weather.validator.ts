import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WeatherService } from '../services/weather.service';

export class WeatherValidator {
  /**
   * Check if the weather is available for the location
   */
  public static checkIfWeatherAvailable(weatherService: WeatherService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return weatherService.getCurrentConditions(control.value).pipe(
        map((forecast) => (forecast ? null : { weatherNotAvailable: true })),
        catchError(() => of({ weatherNotAvailable: true })),
      );
    };
  }
}
