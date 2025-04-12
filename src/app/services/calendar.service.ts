import { Injectable, signal } from '@angular/core';
import { RequestService } from './request.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Calendar, Calendars, DetailDay } from '../models/models';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarService extends RequestService {
  /* Signals */
  private readonly _calendar = signal<Calendars | null>(null);
  calendar = this._calendar.asReadonly();

  set calendars(value: Calendars) {
    this._calendar.set(value);
  }

  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/calendar`);
  }

  getCalendar(params?: Record<string, any>): void {
    this.get<Calendars>('/prev-next', params)
      .pipe(
        tap(
          (resp) =>
            (this.calendars = {
              calendars: {
                previous: {
                  ...resp.calendars.previous,
                  days: resp.calendars.previous?.days.map((day) => ({
                    ...day,
                    date: new Date(day.date),
                  })),
                },
                current: {
                  ...resp.calendars.current,
                  days: resp.calendars.current?.days.map((day) => ({
                    ...day,
                    date: new Date(day.date),
                  })),
                },
                next: {
                  ...resp.calendars.next,
                  days: resp.calendars.next?.days.map((day) => ({
                    ...day,
                    date: new Date(day.date),
                  })),
                },
              },
            })
        )
      )
      .subscribe();
  }
}
