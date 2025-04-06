import { Component, inject, OnInit, output, signal } from '@angular/core';
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
  selectDay = output<string>();

  /* Signals */
  today = signal(new Date());
  monthDays = signal<MonthDay[]>([]);
  prevMonthDays = signal<MonthDay[]>([]);
  nextMonthDays = signal<MonthDay[]>([]);
  calendar = this._calendarService.calendar;

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
    this.daysInCurrentMonth = this.getDaysInMonth(this.today().getMonth());
    this.daysInPreviousMonth = this.getDaysInMonth(
      this.today().getMonth() === 0 ? 11 : this.today().getMonth() - 1
    );
    if (this.today().getMonth() === 0) {
      this.daysInPreviousMonth = this.getDaysInMonth(
        11,
        this.today().getFullYear() - 1
      );
    }
  }

  private initPrevMonthDays(): void {
    const currentMonthFirstDayWeekNumber = this.monthDays()[0].weekNumber;
    for (let i = 1; i < currentMonthFirstDayWeekNumber; i++) {
      const day: MonthDay = {
        weekNumber: i,
        monthNumber:
          this.daysInPreviousMonth - currentMonthFirstDayWeekNumber + i + 1,
        name: getNameOfWeek(
          this.today().getMonth() === 0
            ? this.today().getFullYear() - 1
            : this.today().getFullYear(),
          this.today().getMonth() === 0 ? 11 : this.today().getMonth() - 1,
          this.daysInPreviousMonth - currentMonthFirstDayWeekNumber + i + 1
        ),
        isToday: false,
        completed: false,
        uncompleted: false,
        missed: false,
      };

      this.prevMonthDays.update((prev) => [...prev, day]);
    }
  }

  private initNextMonthDays(): void {
    const currentMonthLastDayWeekNumber =
      this.monthDays()[this.monthDays().length - 1].weekNumber;
    for (let i = 1; i <= DAYS_IN_WEEK - currentMonthLastDayWeekNumber; i++) {
      const day: MonthDay = {
        weekNumber: currentMonthLastDayWeekNumber + i,
        monthNumber: i,
        name: getNameOfWeek(
          this.today().getMonth() === 11
            ? this.today().getFullYear() + 1
            : this.today().getFullYear(),
          this.today().getMonth() === 11 ? 0 : this.today().getMonth() + 1,
          i
        ),
        isToday: false,
        completed: false,
        uncompleted: false,
        missed: false,
      };

      this.nextMonthDays.update((prev) => [...prev, day]);
    }
  }

  private initCalendarGrid(): void {
    this._calendarService.getCalendar({ year: 2025, month: 4 });
    for (let i = 0; i < this.daysInCurrentMonth; i++) {
      const day: MonthDay = {
        weekNumber: getDayOfWeek(
          this.today().getFullYear(),
          this.today().getMonth(),
          i + 1
        ),
        monthNumber: i + 1,
        name: getNameOfWeek(
          this.today().getFullYear(),
          this.today().getMonth(),
          i + 1
        ),
        isToday: this.today().getDate() === i + 1,
        completed: false,
        uncompleted: false,
        missed: false,
      };

      this.monthDays.update((prev) => [...prev, day]);
    }
  }

  ngOnInit(): void {
    this.initMonthDays();
    this.initCalendarGrid();
    this.initPrevMonthDays();
    this.initNextMonthDays();
  }

  getMonthByNumber(monthNumber: number): string {
    return getMonthNameByNumber(monthNumber);
  }

  onSelectDay(dayId: string): void {
    this.selectDay.emit(dayId);
  }
}
