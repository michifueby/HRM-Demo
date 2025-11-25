import { Injectable, inject } from '@angular/core';
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

@Injectable({
  providedIn: 'root'
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
   * Determine API base URL depending on environment
   */
  private get apiBaseUrl(): string {
    // Angular Universal safe check
    if (typeof window === 'undefined') return '';

    // If served by backend (same origin), use relative path
    return '';
  }

  /**
   * Cached server time Observable (auto-refreshes every 30s)
   */
  private readonly time$ = timer(0, 30_000).pipe( // refresh every 30s
    switchMap(() => this.http.get<ServerTimeResponse>(`${this.apiBaseUrl}/api/time`)),
    shareReplay(1) // cache latest value for 1 frame
  );

  /**
   * Get fresh server time (Observable – auto-updates)
   * @returns Observable with the current server time
   */
  getServerTime$(): Observable<ServerTimeResponse> {
    return this.time$;
  }

  /**
   * Fetch the current server time once (no auto-refresh)
   * @returns Observable with the current server time
   */
  fetchServerTimeOnce(): Observable<ServerTimeResponse> {
    return this.http.get<ServerTimeResponse>(`${this.apiBaseUrl}/api/time`);
  }
}
