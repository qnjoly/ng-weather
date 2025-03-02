import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { interval } from 'rxjs';
import { RequestCacheEntry } from '../types/request-cache.type';
import { environment } from '../../../environments/environment';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable()
export class RequestCacheService {
  /**
   * Cache to store the responses
   */
  private readonly cache: WritableSignal<Record<string, RequestCacheEntry>> = signal({});

  /**
   * Max age of the cache
   */
  private static readonly MAX_AGE = environment.cache.maxAge;

  constructor() {
    // Clean the cache every maxAge milliseconds
    interval(RequestCacheService.MAX_AGE).subscribe({
      next: () => this.cleanExpiredCache(),
    });
  }

  /**
   * Get the cache
   * @param req request to get
   * @returns the response if it exists and is not expired
   */
  public get(req: HttpRequest<unknown>): HttpResponse<unknown> | undefined {
    const cached = this.cache()[req.urlWithParams];
    if (!cached) return undefined;
    // We check if the cache is expired and return the response if it is not
    return this.isExpired(cached) ? undefined : cached.response;
  }

  /**
   * Set the cache
   * @param req request to cache
   * @param response response to cache
   */
  public set(req: HttpRequest<unknown>, response: HttpResponse<unknown>): void {
    const url = req.urlWithParams;
    const newEntry = { url, response, initiated: Date.now() };
    // We update the cache with the new entry
    this.cache.update((c) => {
      c[url] = newEntry;
      return { ...c };
    });
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
