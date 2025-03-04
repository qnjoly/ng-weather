import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LocationService } from '@shared/services/location.service';
import { WeatherService } from '@shared/services/weather.service';
import { CustomCurrentConditions } from '@shared/types/weather/current-conditions.type';
import { ConditionsAndZip } from '@weather/types/conditions-and-zip.type';

@Injectable()
export class LocationWeatherService {
  private readonly locationService = inject(LocationService);
  private readonly weatherService = inject(WeatherService);

  /**
   * Retrieve the current conditions for all locations
   * @returns An observable of the current conditions for all locations
   */
  private readonly currentConditions$: Observable<ConditionsAndZip[]> = this.locationService.locations$.pipe(
    switchMap((locations: string[]) => {
      // Parallelize the requests for the current conditions of all locations
      return forkJoin(
        locations.map((location: string) => {
          // Retrieve the current conditions for a location
          return this.weatherService.getCurrentConditionsWithIcon(location).pipe(
            map((currentConditions: CustomCurrentConditions) => ({
              data: currentConditions,
              zip: location,
            })),
            catchError(() => of(null)),
          );
        }),
      ).pipe(catchError(() => of([])));
    }),
    // Filter calls that failed
    map((currentConditions: (ConditionsAndZip | null)[]) => currentConditions.filter((cc) => cc !== null)),
  );

  /**
   * Get the current conditions for all locations
   * @returns A signal of the current conditions for all locationss
   */
  public readonly getCurrentConditions: Signal<ConditionsAndZip[]> = toSignal(this.currentConditions$);
}
