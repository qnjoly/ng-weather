import { fromEvent, Observable, OperatorFunction } from 'rxjs';
import { filter, map, startWith, tap } from 'rxjs/operators';

export const fromStorage = <T>(
  key: string,
  defaultValue: T,
  next: OperatorFunction<T, T> = tap(() => {}),
): Observable<T> =>
  fromEvent<StorageEvent>(window, 'storage').pipe(
    filter((event) => event.key === key),
    map((event) => JSON.parse(event.newValue) ?? defaultValue),
    next,
    startWith(JSON.parse(localStorage.getItem(key)) ?? []),
  );
