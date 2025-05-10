import { Injectable, signal } from '@angular/core';
import { RequestService } from './request.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  Calendar,
  Calendars,
  CalendarWeight,
  DetailDay,
  DetailDayEntity,
} from '../models/models';
import { catchError, finalize, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarService extends RequestService {
  /* Signals */
  private readonly _calendar = signal<Calendars | null>(null);
  calendar = this._calendar.asReadonly();
  private readonly _dayDetail = signal<DetailDay | null>(null);
  dayDetail = this._dayDetail.asReadonly();
  private readonly _isLoading = signal<boolean>(false);
  isLoading = this._isLoading.asReadonly();
  private readonly _calendarWeights = signal<CalendarWeight[]>([]);
  calendarWeights = this._calendarWeights.asReadonly();

  set calendars(value: Calendars) {
    this._calendar.set(value);
  }

  set loading(value: boolean) {
    this._isLoading.set(value);
  }

  set calendarWeightsSignal(value: CalendarWeight[]) {
    this._calendarWeights.set(value);
  }

  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/calendar`);
  }

  getCalendar(params?: Record<string, any>): void {
    this._isLoading.set(true);
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
                    date: day.date ? new Date(day.date) : null,
                  })),
                },
                current: {
                  ...resp.calendars.current,
                  days: resp.calendars.current?.days.map((day) => ({
                    ...day,
                    date: day.date ? new Date(day.date) : null,
                  })),
                },
                next: {
                  ...resp.calendars.next,
                  days: resp.calendars.next?.days.map((day) => ({
                    ...day,
                    date: day.date ? new Date(day.date) : null,
                  })),
                },
              },
            })
        ),
        finalize(() => this._isLoading.set(false))
      )
      .subscribe();
  }

  getDayDetails(dayId: string): void {
    this.getById<DetailDay>(dayId, '/day-detail')
      .pipe(
        tap((dayDetail) =>
          this._dayDetail.set({
            ...dayDetail,
            date: dayDetail.date ? new Date(dayDetail.date) : null,
          })
        ),
        catchError(
          () =>
            this._dayDetail.set({
              date: null,
              tasks: {
                steps: false,
                calories: false,
                training: false,
                suplementation: false,
                weight: false,
              },
              weightNumber: null,
              exercises: []
            }) as any
        ),
        finalize(() => (this.loading = false))
      )
      .subscribe();
  }

  updateDayDetail(
    year: number,
    month: number,
    dayId: string,
    dayDetail: DetailDayEntity
  ): Observable<DetailDayEntity> {
    this.loading = true;
    return this.update<DetailDayEntity>(
      '/update-day',
      `${year}/${month}/${dayId}`,
      dayDetail
    ).pipe(
      tap((resp) =>
        this._dayDetail.set({
          ...resp,
          date: resp.date ? new Date(resp.date) : null,
        })
      ),
      finalize(() => (this.loading = false))
    );
  }

  createDayDetail(
    year: number,
    month: number,
    dayDetail: DetailDayEntity
  ): Observable<DetailDayEntity> {
    this.loading = true;
    return this.create<DetailDayEntity>(
      `/update-day/${year}/${month}`,
      dayDetail
    ).pipe(
      tap((resp) =>
        this._dayDetail.set({
          ...resp,
          date: resp.date ? new Date(resp.date) : null,
        })
      ),
      finalize(() => (this.loading = false))
    );
  }

  getCalendarWeights(): void {
    this.get<CalendarWeight[]>('/corporal-weight')
      .pipe(
        tap((resp) => {
          this.calendarWeightsSignal = resp;
        })
      )
      .subscribe();
  }
}
