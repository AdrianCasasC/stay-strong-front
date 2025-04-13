import { Component, inject } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { Router } from '@angular/router';
import { getDateString } from '../../../utils/utils';
import { GraphComponent } from '../../components/graph/graph.component';

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

  onSelectDay({ dayId, dayDate }: { dayId: string; dayDate: Date }): void {
    this._router.navigate(['detail', dayId, getDateString(dayDate)]);
  }
}
