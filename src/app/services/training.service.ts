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
    super(http, `${environment.apiUrl}/training`);
  }

  getDayExercises(dayId: string): Observable<Exercise[]> {
    return this.get<Exercise[]>(`/${dayId}`).pipe(
      tap((res) => this._exercises.set(res))
    );
  }

  getExercisesTable(file: FormData): any {
    return this.create<any>('/table-data', file).pipe(
      tap(res => {
        console.log('Table data:', this.tableTransformer(res));
      })
    ).subscribe();
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

  tableTransformer(tableData: any[]): any {
    const transformedData: TableData[] = [];
    tableData.shift();
    console.log("Table data - 1: ", tableData);
    tableData = tableData.shift();
    console.log("Table data - 2: ", tableData);

    const cicleWeekDuration = Object.values(tableData.shift()).filter((data: any) => data != null).length;
    console.log("Table data - 3: ", tableData);
    console.log("cicleWeekDuration: ", cicleWeekDuration);

    const formattedTableData: TableData = this.defaultFormattedTableData;
    const formattedTableDay: TableDataDay = this.defaultTableDay;
    const formattedTableExercise: TableDayExercise = this.defaultTableExercise;
    return tableData.forEach(object => {
      let daysCount = 0;
      let weeksCount = 0;
      if (object['Unnamed: 0'] === 'DÍA') {
        daysCount += 1;
        formattedTableDay.dayNumber = daysCount;
        return;
      }
      const patterns = object['Unnamed: 1'] !== null ? object['Unnamed: 1'].split('\r') : []
      const names = object['Unnamed: 2'] !== null ? object['Unnamed: 2'].split('\r') : []
      const rests = object['Unnamed: 4'] !== null ? object['Unnamed: 4'].split('\r') : []
      const reps = object['Unnamed: 5'] !== null ? object['Unnamed: 5'].split('\r') : []
      const sets_rep_weight = object['LIGERA'] !== null ? object['LIGERA'].split('\r') : []
     
      const exercises: TableDayExercise[] = [];
      for (let i = 0; i < patterns.length; i++) {
        exercises.push({
          pattern: patterns[i],
          name: names[i],
          RM: i === 0 ? object['Unnamed: 3'] : null,
          rest: rests[i],
          reps: reps[i],
          sets: null,
          rep: null,
          weight: null
        })
      }
      console.log("Exercises: ", exercises);
    });
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


