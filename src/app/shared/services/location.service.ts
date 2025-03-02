import { effect, Injectable, linkedSignal, WritableSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { STORAGE_KEY_LOCATIONS } from '../constants/storage.constants';
import { fromStorage } from '../helpers/storage.helpers';

@Injectable()
export class LocationService {
  /**
   * An observable of storage events for the locations key
   */
  private readonly storageEvents$ = fromStorage<string[]>(STORAGE_KEY_LOCATIONS, []);

  /**
   * A signal of storage events for the locations key
   */
  private readonly storageEvents = toSignal(this.storageEvents$);

  /**
   * Used to store sync the locations with local storage and provide a signal for the locations
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
    // Only add the location if it is not already in the list
    if (this.locations().includes(zipcode)) {
      return;
    }
    // Update the list of locations
    this.locationsSignal.update((locations) => [...locations, zipcode]);
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
  }
}
