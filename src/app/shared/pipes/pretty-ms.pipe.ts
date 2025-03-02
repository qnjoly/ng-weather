import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'prettyMs' })
export class PrettyMsPipe implements PipeTransform {
  public transform(milliseconds: number): string {
    if (milliseconds < 0 || isNaN(milliseconds)) return 'Invalid time';

    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));

    return `${hours}h ${minutes.toString()}m ${seconds.toString()}s`;
  }
}
