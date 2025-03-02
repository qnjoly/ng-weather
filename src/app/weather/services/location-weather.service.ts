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
      console.log('LocationWeatherService - locations', locations);
      return forkJoin(
        locations.map((location: string) => {
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
    map((currentConditions: (ConditionsAndZip | null)[]) => currentConditions.filter((cc) => cc !== null)),
  );

  /**
   * Get the current conditions for all locations
   * @returns A signal of the current conditions for all locationss
   */
  public readonly getCurrentConditions: Signal<ConditionsAndZip[]> = toSignal(this.currentConditions$);

  /**
   * Remove a location from the list of locations
   * @param zip The zip code of the location to remove
   */
  public removeLocation(zip?: string): void {
    this.locationService.removeLocation(zip);
  }

  /**
   * Add a location to the list of locations
   * @param zip The zip code of the location to add
   */
  public addLocation(zip: string): void {
    this.locationService.addLocation(zip);
  }
}
