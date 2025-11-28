import { Component, inject, OnInit } from '@angular/core';
import { TimeService } from '@hrm/shared/time-service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
/**
 * AppComponent for the HR Core application.
 */
export class AppComponent implements OnInit {
  /**
   * TimeService instance for fetching server time.
   */
  private timeService = inject(TimeService);

  /**
   * Title of the application.
   */
  public title = 'HR Core';

  /**
   * Server time display string.
   */
  public serverTime = 'Loading...';

  /**
   * Current URL of the application.
   */
  public currentUrl = typeof window !== 'undefined' ? window.location.origin : '';

  /**
   * Links to other services based on the environment.
   */
  public links = {
    metrics: environment.production ? environment.metricsUrl : 'http://localhost:3001',
    activities: environment.production ? environment.activitiesUrl : 'http://localhost:3002'
  };

  /**
   * OnInit lifecycle hook to fetch server time.
   */
  public ngOnInit(): void {
    this.timeService.getServerTime$().subscribe(data => {
      this.serverTime = new Date(data.serverTime).toLocaleString();
    });
  }
}
