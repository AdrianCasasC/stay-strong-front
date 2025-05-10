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
    console.log("TABLE DATA: ", tableData);
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
    const table: any[] =  [];
    tableData.forEach(object => {
      let daysCount = 0;
      let weeksCount = 0;
      if (object['Unnamed: 0'] === 'DÍA') {
        daysCount += 1;
        formattedTableDay.dayNumber = daysCount;
        return;
      }
      const weeks = [];
      for (let week = 0; week < cicleWeekDuration; week++) {
        const patterns = object['Unnamed: 1'] !== null ? object['Unnamed: 1'].split('\r') : []
        const names = object['Unnamed: 2'] !== null ? object['Unnamed: 2'].split('\r') : []
        const rests = object['Unnamed: 4'] !== null ? object['Unnamed: 4'].split('\r') : []
        const reps = object['Unnamed: 5'] !== null ? object['Unnamed: 5'].split('\r') : []
        
        const keys = Object.keys(object);
        const weekCase = keys[week + cicleWeekDuration + 1];
        let sets_rep_weight = object[weekCase] !== null ? object[weekCase].split('\r') : [];
        console.log("weekCase: ", weekCase);
        console.log("sets_rep_weight: ", sets_rep_weight);
        if (sets_rep_weight.length > 1) {

          if (sets_rep_weight[1].includes("RM")) {
            sets_rep_weight[1] = sets_rep_weight[1].replace("RM", "RMx")
          }
          const [first, second, ...rest] = sets_rep_weight;
          const first_second = first.charAt(first.length - 1) === 'x' ? [first.charAt(0), second].join('x') : [first, second].join('x');
          sets_rep_weight = [first_second, ...rest];
        }
        
        console.log("sets_rep_weight: ", sets_rep_weight);
        console.log("sets_rep_weight length: ", sets_rep_weight.length);
        console.log("patterns: ", patterns);
        console.log("patterns length: ", patterns.length);
        const exercises: TableDayExercise[] = [];
        for (let i = 0; i < sets_rep_weight.length; i++) {
          
          const splitted_set_rep_weight = sets_rep_weight[i].split('x');
          console.log("splitted_set_rep_weight: ", splitted_set_rep_weight);
          let rep;
          let weight;
          if (sets_rep_weight[0].includes('-')) {
            rep = splitted_set_rep_weight[1];
            weight = splitted_set_rep_weight[2];
          } else {
            const rep_weight = splitted_set_rep_weight[1];
            const [repFirst, ...weightRest] = rep_weight;
            rep = repFirst;
            weight = weightRest;
          }
          console.log("rep: ", rep);
          console.log("weight: ", weight);

          exercises.push({
            pattern: patterns[i],
            name: names[i],
            RM: i === 0 ? object['Unnamed: 3'] : null,
            rest: rests[i],
            reps: reps[i],
            sets: splitted_set_rep_weight[0],
            rep,
            weight: weight
          })
        }
        weeks.push({
          weekNumber: week,
          days: exercises
        })
        console.log("Exercises: ", exercises);
        console.log("Weeks: ", weeks);
        
      }
      table.push(weeks)
      console.log("Table: ", table);
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


