import { Injectable, signal } from '@angular/core';
import { Exercise } from '../models/models';
import { RequestService } from './request.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainingService extends RequestService {
  /* Signals */
  private readonly _exercises = signal<Exercise[]>([]);
  exercises = this._exercises.asReadonly();

  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/training`);
  }

  getDayExercises(dayId: string): Observable<Exercise[]> {
    return this.get<Exercise[]>(`/${dayId}`).pipe(
      tap((res) => this._exercises.set(res))
    );
  }

  saveDayExercises(
    dayId: string,
    exercises: Exercise[]
  ): Observable<Exercise[]> {
    return this.create<Exercise[]>(`/${dayId}`, exercises);
  }

  updateDayExercise(
    dayId: string,
    exercises: Exercise[]
  ): Observable<Exercise[]> {
    return this.update<Exercise[]>('', dayId, exercises);
  }
}
