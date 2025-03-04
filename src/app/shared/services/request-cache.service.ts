import { HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject, Injectable, InjectionToken, linkedSignal, WritableSignal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RequestCacheEntry } from '@shared/types/cache/request-cache.type';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, filter, take, switchMap, tap, shareReplay, catchError } from 'rxjs/operators';
import { STORAGE_KEY_CACHE_MAX_AGE, STORAGE_KEY_CACHE_REQUESTS } from '@shared/constants/storage.constants';
import { fromStorage } from '@shared/helpers/storage.helpers';
import { ConfigurationCache } from '@shared/types/cache/configuration.type';

export const CONF_CACHE = new InjectionToken<ConfigurationCache>('CONF_CACHE');

@Injectable()
export class RequestCacheService {
  private readonly conf: ConfigurationCache = inject(CONF_CACHE);

  /**
   * An observable of storage events for the requests cache key
   */
  private readonly storageEvents$ = fromStorage(STORAGE_KEY_CACHE_REQUESTS, {});

  /**
   * A signal of storage events for the requests cache key
   */
  private readonly storageEvents = toSignal(this.storageEvents$);

  /**
   * Used to sync the cache with local storage and then provide a signal to store the requests cache
   */
  private readonly cache: WritableSignal<Record<string, RequestCacheEntry>> = linkedSignal(() => this.storageEvents());

  /**
   * An observable of the cache
   */
  private readonly cache$ = toObservable(this.cache).pipe(shareReplay(1));

  /**
   * An observable of storage events for the maximum age of the cache
   */
  private readonly maxAgeEvents$ = fromStorage<string>(STORAGE_KEY_CACHE_MAX_AGE, this.conf.maxAge.toString());

  /**
   * A signal of storage events for the maximum age of the cache
   */
  private readonly maxAgeEvents = toSignal(
    this.maxAgeEvents$.pipe(
      // Transform the value to a number
      map((v) => {
        const maxAge = parseInt(v, 10);
        return isNaN(maxAge) ? this.conf.maxAge : maxAge;
      }),
    ),
  );

  /**
   * Used to sync the maximum age with local storage and then provide a signal to edit it
   */
  private readonly maxAge: WritableSignal<number> = linkedSignal(() => this.maxAgeEvents());

  /**
   * Expose the max age as a readonly signal
   */
  public readonly getMaxAge = this.maxAge.asReadonly();

  /**
   * Get a cached response
   * @param req request to get
   * @param type type of the response to get
   * @returns an observable of the response if type is 'observable', the response if type is 'instant', or undefined if the cache is empty or expired
   */
  public get(req: HttpRequest<unknown>, type: 'observable'): Observable<HttpResponse<unknown> | undefined>;
  public get(req: HttpRequest<unknown>, type: 'instant'): HttpResponse<unknown> | undefined;
  public get(
    req: HttpRequest<unknown>,
    type: 'observable' | 'instant',
  ): Observable<HttpResponse<unknown> | undefined> | HttpResponse<unknown> | undefined {
    const isObservable = type === 'observable';
    const cached = this.cache()[req.urlWithParams];
    // If the cache is empty, we return undefined
    if (!cached) {
      return isObservable ? of(undefined) : undefined;
    }
    // If the cache is expired, we return undefined
    if (this.isExpired(cached)) {
      return isObservable ? of(undefined) : undefined;
    }
    // If the cache is in progress, we return the cached response when it is done (used to prevent multiple requests for the same resource when it is loading)
    if (isObservable && cached.inProgress) {
      return this.cache$.pipe(
        map((c) => c[req.urlWithParams]),
        filter((c) => !c.inProgress),
        map((c) => c?.response),
        take(1),
      );
    }
    // Else we return the cached response
    return isObservable ? of(cached.response) : cached.response;
  }

  /**
   * Set the cache
   * @param req request to cache
   * @param response response to cache
   */
  public set(req: HttpRequest<unknown>, response: HttpResponse<unknown>): void {
    const url = req.urlWithParams;
    const newEntry = { url, response, initiated: Date.now(), inProgress: false };
    // We update the cache with the new entry
    this.updateCache(url, newEntry);
  }

  /**
   * Update the cache
   * @param key key to update (url of the request)
   * @param value cache entry to update
   */
  private updateCache(key: string, value: RequestCacheEntry): void {
    this.cache.update((c) => {
      c[key] = value;
      return { ...c };
    });
    localStorage.setItem(STORAGE_KEY_CACHE_REQUESTS, JSON.stringify(this.cache()));
  }

  /**
   * Send the request and cache the response
   * @param req request to send
   * @param next next handler
   * @returns an observable of type HttpEvent
   */
  public cacheRequest(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpResponse<unknown>> {
    return of(void 0).pipe(
      tap(() => {
        // We declare the request as in progress
        this.updateCache(req.urlWithParams, { url: req.urlWithParams, initiated: Date.now(), inProgress: true });
      }),
      switchMap(() =>
        // We send the request
        next.handle(req).pipe(
          catchError((error: HttpEvent<unknown>) => {
            return of(new HttpResponse(error as HttpResponse<unknown>));
          }),
        ),
      ),
      tap((event: HttpResponse<unknown>) => {
        // When the response is received, we cache it
        this.set(req, event);
      }),
    );
  }

  /**
   * Check if the cache is expired
   * @param entry cache entry to check
   * @returns a boolean
   */
  private isExpired(entry: RequestCacheEntry): boolean {
    const expiredAt = entry.initiated + this.maxAge();
    return expiredAt < Date.now();
  }

  /**
   * Set the maximum age of the cache
   * @param maxAge maximum age in milliseconds
   */
  public setMaxAge(maxAge: number): void {
    this.maxAge.set(maxAge);
    localStorage.setItem(STORAGE_KEY_CACHE_MAX_AGE, this.maxAge().toString());
  }
}
