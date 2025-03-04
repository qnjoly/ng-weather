import { Injectable, linkedSignal, WritableSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { STORAGE_KEY_LOCATIONS } from '@shared/constants/storage.constants';
import { fromStorage } from '@shared/helpers/storage.helpers';
import { delay } from 'rxjs/operators';

@Injectable()
export class LocationService {
  /**
   * An observable of storage events for the locations key (used delay to help synchronize with local storage)
   */
  private readonly storageEvents$ = fromStorage<string[]>(STORAGE_KEY_LOCATIONS, [], delay(1000));

  /**
   * A signal of storage events for the locations key
   */
  private readonly storageEvents = toSignal(this.storageEvents$);

  /**
   * Used to sync the locations with local storage and then provide a signal for the locations
   */
  private readonly locationsSignal: WritableSignal<string[]> = linkedSignal(() => this.storageEvents());

  /**
   * The list of locations that the user has added
   */
  public readonly locations = this.locationsSignal.asReadonly();

  /**
   * An observable of the list of locations (used to chain with other observables)
   */
  public readonly locations$: Observable<string[]> = toObservable(this.locations);

  /**
   * Add a location to the list of locations
   * @param zipcode The zip code of the location to add
   */
  public addLocation(zipcode: string): void {
    // Only add the location if it is not already in the list
    if (this.locations().includes(zipcode)) {
      return;
    }
    // Update the list of locations
    this.locationsSignal.update((locations) => [...locations, zipcode]);
    localStorage.setItem(STORAGE_KEY_LOCATIONS, JSON.stringify(this.locations()));
  }

  /**
   * Remove a location from the list of locations
   * @param zipcode The zip code of the location to remove
   */
  public removeLocation(zipcode: string): void {
    this.locationsSignal.update((locations) => {
      // Search for the location in the list
      const index = locations.indexOf(zipcode);
      // If the location is found, remove it
      if (index !== -1) {
        locations.splice(index, 1);
      }
      // Return the updated list of locations
      return [...locations];
    });
    localStorage.setItem(STORAGE_KEY_LOCATIONS, JSON.stringify(this.locations()));
  }
}
