import { Injectable, signal } from '@angular/core';
import { RequestService } from './request.service';
import { DetailDay } from '../models/models';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DayDetailService extends RequestService {
  /* Signals */
  private readonly _dayDetail = signal<DetailDay | null>(null);
  dayDetail = this._dayDetail.asReadonly();
  private readonly _dayId = signal<string>('');
  dayIdVal = this._dayId.asReadonly();
  private readonly _dayDate = signal<string>('');
  dayDateVal = this._dayDate.asReadonly();

  set detail(value: DetailDay | null) {
    this._dayDetail.set(value);
  }

  set dayId(value: string) {
    this._dayId.set(value);
  }

  set dayDate(value: string) {
    this._dayDate.set(value);
  }

  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/day-details`);
  }

  getDayDetails(dayId: string): void {
    this.getById<DetailDay>(dayId)
      .pipe(
        tap(
          (dayDetail) =>
            (this.detail = {
              ...dayDetail,
              date: dayDetail.date ? new Date(dayDetail.date) : null,
            })
        )
      )
      .subscribe();
  }
}
