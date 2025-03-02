import { HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, linkedSignal, WritableSignal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RequestCacheEntry } from '../types/request-cache.type';
import { environment } from '../../../environments/environment';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, filter, take, switchMap, tap, shareReplay } from 'rxjs/operators';
import { STORAGE_KEY_REQUESTS_CACHE } from '../constants/storage.constants';
import { fromStorage } from '../helpers/storage.helpers';

@Injectable()
export class RequestCacheService {
  /**
   * An observable of storage events for the requests cache key
   */
  private readonly storageEvents$ = fromStorage(STORAGE_KEY_REQUESTS_CACHE, {});

  /**
   * A signal of storage events for the requests cache key
   */
  private readonly storageEvents = toSignal(this.storageEvents$);

  /**
   * Cache to store the responses
   */
  private readonly cache: WritableSignal<Record<string, RequestCacheEntry>> = linkedSignal(() => this.storageEvents());

  /**
   * An observable of the cache
   */
  private readonly cache$ = toObservable(this.cache).pipe(shareReplay(1));

  /**
   * Max age of the cache
   */
  private static readonly MAX_AGE = environment.cache.maxAge;

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
    // If the cache is in progress, we return the cached response when it is done
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
    localStorage.setItem(STORAGE_KEY_REQUESTS_CACHE, JSON.stringify(this.cache()));
  }

  /**
   * Send the request and cache the response
   * @param req request to send
   * @param next next handler
   * @returns an observable of type HttpEvent
   */
  public cacheRequest(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return of(void 0).pipe(
      tap(() => {
        // We declare the request as in progress
        this.updateCache(req.urlWithParams, { url: req.urlWithParams, initiated: Date.now(), inProgress: true });
      }),
      switchMap(() =>
        // We send the request
        next.handle(req),
      ),
      tap((event) => {
        // When the response is received, we cache it
        if (event instanceof HttpResponse) {
          this.set(req, event);
        }
      }),
    );
  }

  /**
   * Operation to clean the expired cache
   */
  private cleanExpiredCache(): void {
    this.cache.update((c: Record<string, RequestCacheEntry>) => {
      // For each entry, we check if it is expired and delete it if it is
      for (const url of Object.keys(c)) {
        const entry = c[url];
        if (this.isExpired(entry)) {
          delete c[url];
        }
      }
      // We return the new cache
      return { ...c };
    });
  }

  /**
   * Check if the cache is expired
   * @param entry cache entry to check
   * @returns a boolean
   */
  private isExpired(entry: RequestCacheEntry): boolean {
    const expiredAt = entry.initiated + RequestCacheService.MAX_AGE;
    return expiredAt < Date.now();
  }
}
