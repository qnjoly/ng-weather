import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'prettyMs' })
export class PrettyMsPipe implements PipeTransform {
  /**
   * Transform milliseconds into a human-readable format
   * @param milliseconds The milliseconds to transform
   * @returns The human-readable format of the milliseconds
   */
  public transform(milliseconds: number): string {
    if (milliseconds < 0 || isNaN(milliseconds)) return 'Invalid time';

    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));

    return `${hours}h ${minutes.toString()}m ${seconds.toString()}s`;
  }
}
