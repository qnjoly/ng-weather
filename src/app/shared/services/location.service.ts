import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { STORAGE_KEY_LOCATIONS } from '../constants/storage.constants';

@Injectable()
export class LocationService {
  /**
   * Used to store the list of locations
   */
  private readonly locationsSignal: WritableSignal<string[]> = signal(
    JSON.parse(localStorage.getItem(STORAGE_KEY_LOCATIONS)) ?? [],
  );

  /**
   * The list of locations
   */
  public readonly locations = this.locationsSignal.asReadonly();

  /**
   * An observable of the list of locations
   */
  public readonly locations$: Observable<string[]> = toObservable(this.locations);

  constructor() {
    // Save the locations to local storage whenever the list changes
    effect(() => {
      localStorage.setItem(STORAGE_KEY_LOCATIONS, JSON.stringify(this.locations()));
    });
  }

  /**
   * Add a location to the list of locations
   * @param zipcode The zip code of the location to add
   */
  public addLocation(zipcode: string): void {
    this.locationsSignal.update((locations) => [...locations, zipcode]);
  }

  /**
   * Remove a location from the list of locations
   * @param zipcode The zip code of the location to remove
   */
  public removeLocation(zipcode?: string, index: number = -1): void {
    this.locationsSignal.update((locations) => {
      if (!zipcode && index !== -1) {
        locations.splice(index, 1);
      } else {
        const i = locations.indexOf(zipcode);
        if (i !== -1) {
          locations.splice(index, 1);
        }
      }

      return [...locations];
    });
  }
}
