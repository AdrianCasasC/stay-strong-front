export interface MonthDay {
  id?: string;
  date: Date,
  weekNumber: number;
  monthNumber: number;
  name: string;
  isToday: boolean;
  completed: boolean;
  uncompleted: boolean;
  missed: boolean;
}

export interface MonthDayDto extends MonthDay {
  date: Date;
}

interface DayTask {
  steps: boolean;
  calories: boolean;
  training: boolean;
  suplementation: boolean;
  weight: boolean;
}

export interface DetailDay {
  id: string;
  date: Date;
  task: DayTask;
}

export interface Calendar {
  id: string;
  year: number;
  month: number;
  days: DetailDay[];
}
