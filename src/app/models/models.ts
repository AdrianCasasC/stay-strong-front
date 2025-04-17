export interface MonthDay {
  id?: string;
  date: Date;
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
  id?: string;
  date: Date | null;
  tasks: DayTask;
  weightNumber: number | null;
}

export interface DetailDayEntity {
  id?: string;
  date: string;
  tasks: DayTask;
  weightNumber: number | null;
}

export interface Calendar {
  id: string;
  year: number;
  month: number;
  days: DetailDay[];
}

export interface PrevCurrNextCalendar {
  previous: Calendar;
  current: Calendar;
  next: Calendar;
}

export interface Calendars {
  calendars: PrevCurrNextCalendar;
}

export interface CalendarWeight {
  date: string;
  weight: number;
}

export interface Serie {
  repetitions: number;
  weight: number;
}

export interface Exercise {
  name: string;
  series: Serie[];
}

export type FooterTab = 'home' | 'list' | 'training';
