import { Injectable, signal } from '@angular/core';
import { RequestService } from './request.service';
import { DetailDay } from '../models/models';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DayDetailService extends RequestService<DetailDay> {
  /* Signals */
  private readonly _dayDetail = signal<DetailDay | null>(null);
  dayDetail = this._dayDetail.asReadonly();

  set detail(value: DetailDay | null) {
    this._dayDetail.set(value);
  }

  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/detail`);
  }

  getDayDetails(dayId: string): void {
    this.getById(dayId).subscribe((dayDetail) => {
      this.detail = dayDetail;
    });
  }
}
