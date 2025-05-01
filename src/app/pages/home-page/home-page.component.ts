import { Component, inject } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { Router } from '@angular/router';
import { getDateString } from '../../../utils/utils';
import { GraphComponent } from '../../components/graph/graph.component';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CalendarComponent, GraphComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  /* Injections */
  private readonly _router = inject(Router);
  private readonly _calendarService = inject(CalendarService);

  /* Signals */
  isLoading = this._calendarService.isLoading;

  onSelectDay({ dayId, dayDate }: { dayId: string; dayDate: Date }): void {
    this._router.navigate(['details', dayId, getDateString(dayDate)]);
  }
}
