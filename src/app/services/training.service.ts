import { Injectable, signal } from '@angular/core';
import { Exercise, Training } from '../models/models';
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
  private readonly _loading = signal<boolean>(false);
  exercises = this._exercises.asReadonly();
  loading = this._loading.asReadonly();

  /* Variables */
  defaultTableExercise: TableDayExercise = {
    pattern: null,
    name: null,
    RM: null,
    rest: null,
    reps: null,
    sets: null,
    rep: null,
    weight: null,
  }

  defaultTableDay: TableDataDay = {
    dayNumber: null,
    dayName: null,
    exercises: []
  }

  defaultFormattedTableData: TableData = {
    weekNumber: null,
    effort: null,
    days: []
  }

  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/calendar/day-detail`);
  }

  setLoading(value: boolean): void {
    this._loading.set(value);
  }

  saveDayExercises(
    dayId: string,
    exercises: Exercise[]
  ): Observable<Exercise[]> {
    return this.create<Exercise[]>(`/${dayId}/training`, exercises);
  }

  updateDayExercise(
    dayId: string,
    training: Training
  ): Observable<Training> {
    this._loading.set(true);
    return this.update<Training>('/training', dayId, training);
  }
}

interface TableDayExercise {
  pattern: string | null;
  name: string | null;
  RM: string | null;
  rest: string | null;
  reps: string | null;
  sets: number | null;
  rep: string | null;
  weight: string | null;
}

interface TableDataDay {
  dayNumber: number | null;
  dayName: string | null;
  exercises: TableDayExercise[];
}

interface TableData {
  weekNumber: number | null;
  effort: string | null;
  days: TableDataDay[];
}


