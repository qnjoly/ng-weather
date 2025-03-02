import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RequestCacheService } from '../services/request-cache.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CacheApiInterceptor implements HttpInterceptor {
  private readonly requestCacheService = inject(RequestCacheService);

  /**
   * Use to intercept all http requests
   * @param req request to intercept
   * @param next next handler
   * @returns an observable of type HttpEvent
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const cacheable = this.isCacheable(req);
    // If the request is not cacheable, we send it directly
    if (!cacheable.statut) {
      return next.handle(req);
    }
    // If the request is cacheable, we check if we have a cached response else we send the request
    const cachedResponse = this.requestCacheService.get(req);
    return cachedResponse ? of(cachedResponse) : this.sendRequest(req, next);
  }

  /**
   * Check if the request is cacheable
   * @param req request to check
   * @returns an object with a boolean and a possible motif
   */
  private isCacheable(req: HttpRequest<unknown>): {
    statut: boolean;
    motif?: 'METHOD';
  } {
    // Only GET requests are cacheable
    if (req.method !== 'GET') return { statut: false, motif: 'METHOD' };
    return { statut: true };
  }

  /**
   * Send the request and cache the response
   * @param req request to send
   * @param next next handler
   * @returns an observable of type HttpEvent
   */
  private sendRequest(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.requestCacheService.set(req, event);
        }
      }),
    );
  }
}
