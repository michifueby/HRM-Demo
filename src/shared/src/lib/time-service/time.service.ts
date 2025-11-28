import { Inject, Injectable, InjectionToken, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';

/**
 * Shared TimeService – used by all three HRM modules
 * Features:
 * - Auto-detects API base URL (same origin in prod, localhost in dev)
 * - Caches server time for 1 second (reduces load during peak usage)
 * - Auto-refreshes every 30 seconds
 */
export interface ServerTimeResponse {
  serverTime: string;
  app: string;
  version?: string;
}

/**
 * Injection token for API URL
 */
export const API_URL = new InjectionToken<string>('API_URL');

@Injectable({
  providedIn: 'root',
})
/**
 * TimeService to fetch server time from backend API
 */
export class TimeService {
  /**
   * HttpClient instance for making HTTP requests
   */
  private readonly http = inject(HttpClient);

  /**
   * Initializes a new instance of the TimeService class.
   * @param apiUrl The base URL of the API.
   */
  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    @Inject(API_URL) private apiUrl: string
  ) {}

  /**
   * Cached server time Observable (auto-refreshes every 30s)
   */
  private readonly time$ = timer(0, 30_000).pipe(
    switchMap(() =>
      this.http.get<ServerTimeResponse>(`${this.apiUrl}/api/time`)
    ),
    shareReplay(1)
  );

  /**
   * Get the server time Observable (auto-refreshes every 30s)
   * @returns The server time Observable
   */
  getServerTime$(): Observable<ServerTimeResponse> {
    return this.time$;
  }
}
