import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { LocationService } from '../services/location.service';

export class LocationValidator {
  /**
   * Check if the location is already registered
   * @param locationService The location service
   * @returns An async validator function that checks if the location is already registered
   */
  public static checkIfLocationAlreadyRegistered(locationService: LocationService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return locationService.locations$.pipe(
        map((locations: string[]) => (locations.includes(control.value) ? { locationAlreadyExists: true } : null)),
        take(1),
      );
    };
  }
}
