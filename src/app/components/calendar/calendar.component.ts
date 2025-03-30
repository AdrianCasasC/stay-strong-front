import { Component, OnInit, signal } from '@angular/core';
import {
  getDayOfWeek,
  getMonthNameByNumber,
  getNameOfWeek,
} from '../../utils/calendar';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  /* Signals */
  today = signal(new Date());
  monthDays = signal<MonthDay[]>([]);

  /* Variables */
  daysInCurrentMonth: number = 0;
  daysInPreviousMonth: number = 0;

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
    this.daysInCurrentMonth = this.getDaysInMonth(new Date().getMonth());

    if (this.today().getMonth() === 0) {
      this.daysInPreviousMonth = this.getDaysInMonth(
        11,
        this.today().getFullYear() - 1
      );
    }
  }

  private initCalendarGrid(): void {
    for (let i = 0; i < this.daysInCurrentMonth; i++) {
      const day: MonthDay = {
        weekNumber: getDayOfWeek(
          this.today().getFullYear(),
          this.today().getMonth() + 1,
          i + 1
        ),
        monthNumber: i + 1,
        name: getNameOfWeek(
          this.today().getFullYear(),
          this.today().getMonth() + 1,
          i + 1
        ),
        isToday: this.today().getDate() === i + 1,
        completed: false,
        missed: false,
      };

      this.monthDays.update((prev) => [...prev, day]);
    }
  }

  ngOnInit(): void {
    this.initMonthDays();
    this.initCalendarGrid();
    console.log('Days: ', this.monthDays());
  }

  getMonthByNumber(monthNumber: number): string {
    return getMonthNameByNumber(monthNumber);
  }
}

interface MonthDay {
  weekNumber: number;
  monthNumber: number;
  name: string;
  isToday: boolean;
  completed: boolean;
  missed: boolean;
}
