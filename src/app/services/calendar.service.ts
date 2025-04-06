import { Injectable, signal } from '@angular/core';
import { RequestService } from './request.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Calendar } from '../models/models';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarService extends RequestService<Calendar> {
  /* Signals */
  private readonly _calendar = signal<Calendar[]>([]);
  calendar = this._calendar.asReadonly();

  set calendarVal(value: Calendar[]) {
    this._calendar.set(value);
  }

  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/calendar`);
  }

  getCalendar(params?: Record<string, any>): void {
    this.get('/prev-next', params)
      .pipe(
        tap(
          (calendar) =>
            (this.calendarVal = calendar.map((cal) => ({
              ...cal,
              days: cal.days.map((day) => ({
                ...day,
                date: new Date(day.date),
              })),
            })))
        )
      )
      .subscribe();
  }
}
