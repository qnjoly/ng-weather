import { fromEvent, Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

export const fromStorage = <T>(key: string, defaultValue: T): Observable<T> =>
  fromEvent<StorageEvent>(window, 'storage').pipe(
    filter((event) => event.key === key),
    map((event) => JSON.parse(event.newValue) ?? defaultValue),
    startWith(JSON.parse(localStorage.getItem(key)) ?? []),
  );
