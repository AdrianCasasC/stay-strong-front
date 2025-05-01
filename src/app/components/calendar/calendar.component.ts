import {
  Component,
  effect,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  DAYS_IN_WEEK,
  DAYS_OF_WEEK,
  getDayOfWeek,
  getMonthNameByNumber,
  getNameOfWeek,
} from '../../utils/calendar';
import { MonthDay } from '../../models/models';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  /* Injections */
  private readonly _calendarService = inject(CalendarService);

  /* Outputs */
  selectDay = output<{ dayId: string; dayDate: Date }>();

  /* Signals */
  today = signal(new Date());
  monthDays: MonthDay[] = [];
  prevMonthDays: MonthDay[] = [];
  nextMonthDays: MonthDay[] = [];
  calendar = this._calendarService.calendar;
  currentYear = this.today().getFullYear();
  currentMonth = this.today().getMonth();

  /* Variables */
  daysInCurrentMonth: number = 0;
  daysInPreviousMonth: number = 0;
  week_days = DAYS_OF_WEEK;

  private getDaysInMonth(
    monthNumber: number,
    year: number = new Date().getFullYear()
  ): number {
    if (monthNumber < 0) {
      return 0;
    }

    // Get the last day of the current month by setting the date to 0 of the next month
    return new Date(year, monthNumber + 1, 0).getDate();
  }

  private initMonthDays(): void {
    this.daysInCurrentMonth = this.getDaysInMonth(this.currentMonth);
    if (this.currentMonth === 0) {
      this.daysInPreviousMonth = this.getDaysInMonth(
        11,
        this.today().getFullYear() - 1
      );
    } else {
      this.daysInPreviousMonth = this.getDaysInMonth(
        this.currentMonth === 0 ? 11 : this.currentMonth - 1
      );
    }
  }

  private initPrevMonthDays(): void {
    const currentMonthFirstDayWeekNumber = this.monthDays[0].weekNumber;
    for (let i = 1; i < currentMonthFirstDayWeekNumber; i++) {
      const day: MonthDay = {
        date: new Date(
          this.currentMonth === 0
            ? this.today().getFullYear() - 1
            : this.today().getFullYear(),
          this.currentMonth === 0 ? 11 : this.currentMonth - 1,
          this.daysInPreviousMonth - currentMonthFirstDayWeekNumber + i + 1
        ),
        weekNumber: i,
        monthNumber:
          this.daysInPreviousMonth - currentMonthFirstDayWeekNumber + i + 1,
        name: getNameOfWeek(
          this.currentMonth === 0
            ? this.today().getFullYear() - 1
            : this.today().getFullYear(),
          this.currentMonth === 0 ? 11 : this.currentMonth - 1,
          this.daysInPreviousMonth - currentMonthFirstDayWeekNumber + i + 1
        ),
        isToday: false,
        completed: false,
        uncompleted: false,
        missed: false,
      };

      this.prevMonthDays.push(day);
    }
  }

  private initNextMonthDays(): void {
    const currentMonthLastDayWeekNumber =
      this.monthDays[this.monthDays.length - 1].weekNumber;
    for (let i = 1; i <= DAYS_IN_WEEK - currentMonthLastDayWeekNumber; i++) {
      const day: MonthDay = {
        date: new Date(
          this.currentMonth === 11
            ? this.today().getFullYear() + 1
            : this.today().getFullYear(),
          this.currentMonth === 11 ? 0 : this.currentMonth + 1,
          i
        ),
        weekNumber: currentMonthLastDayWeekNumber + i,
        monthNumber: i,
        name: getNameOfWeek(
          this.currentMonth === 11
            ? this.today().getFullYear() + 1
            : this.today().getFullYear(),
          this.currentMonth === 11 ? 0 : this.currentMonth + 1,
          i
        ),
        isToday: false,
        completed: false,
        uncompleted: false,
        missed: false,
      };

      this.nextMonthDays.push(day);
    }
  }

  private initCalendarGrid(): void {
    this._calendarService.getCalendar({ year: this.currentYear, month: this.currentMonth + 1 });
    for (let i = 0; i < this.daysInCurrentMonth; i++) {
      const day: MonthDay = {
        date: new Date(
          this.today().getFullYear(),
          this.currentMonth,
          i + 1
        ),
        weekNumber: getDayOfWeek(
          this.today().getFullYear(),
          this.currentMonth,
          i + 1
        ),
        monthNumber: i + 1,
        name: getNameOfWeek(
          this.today().getFullYear(),
          this.currentMonth,
          i + 1
        ),
        isToday: this.today().getDate() === i + 1,
        completed: false,
        uncompleted: false,
        missed: false,
      };

      this.monthDays.push(day);
    }
  }

  private resetMonthDays(): void {
    this.monthDays = [];
    this.prevMonthDays = [];
    this.nextMonthDays = [];
  }

  private initAll(): void {
    this.initMonthDays();
    this.initCalendarGrid();
    this.initPrevMonthDays();
    this.initNextMonthDays();
  }

  constructor() {
    effect(() => {
      this.calendar()?.calendars.previous?.days.forEach((day) => {
        this.prevMonthDays.forEach((prevMonthDay) => {
          if (day.date?.getDate() === prevMonthDay.date.getDate()) {
            prevMonthDay.id = day.id;
            prevMonthDay.date = day.date;
            prevMonthDay.completed = Object.keys(day.tasks).every(
              (taskKey) => day.tasks[taskKey as keyof typeof day.tasks] === true
            );
            prevMonthDay.uncompleted = Object.keys(day.tasks).every(
              (taskKey) =>
                day.tasks[taskKey as keyof typeof day.tasks] === false
            );
            prevMonthDay.missed = Object.keys(day.tasks).some(
              (taskKey) =>
                day.tasks[taskKey as keyof typeof day.tasks] === false
            );
          }
        });
      });
      this.calendar()?.calendars.current?.days.forEach((day) => {
        this.monthDays.forEach((monthDay) => {
          if (day.date?.getDate() === monthDay.date.getDate()) {
            monthDay.id = day.id;
            monthDay.date = day.date;
            monthDay.completed = Object.keys(day.tasks).every(
              (taskKey) => day.tasks[taskKey as keyof typeof day.tasks] === true
            );
            monthDay.uncompleted = Object.keys(day.tasks).every(
              (taskKey) =>
                day.tasks[taskKey as keyof typeof day.tasks] === false
            );
            monthDay.missed = Object.keys(day.tasks).some(
              (taskKey) =>
                day.tasks[taskKey as keyof typeof day.tasks] === false
            );
          }
        });
      });
    });
  }

  ngOnInit(): void {
    this.initAll();
  }

  getMonthByNumber(monthNumber: number): string {
    return getMonthNameByNumber(monthNumber);
  }

  onSelectDay(detailDayParams: { dayId: string; dayDate: Date }): void {
    this.selectDay.emit(detailDayParams);
  }

  prevMonth(): void {
    this.currentMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
    if (this.currentMonth === 11) {
      this.currentYear = this.currentYear - 1;
    }
    this.resetMonthDays();
    this.initAll();
  }

  nextMonth(): void {
    this.currentMonth = this.currentMonth === 11 ? 1 : this.currentMonth + 1;
    if (this.currentMonth === 1) {
      this.currentYear = this.currentYear + 1;
    }
    this.resetMonthDays();
    this.initAll();
  }
}
