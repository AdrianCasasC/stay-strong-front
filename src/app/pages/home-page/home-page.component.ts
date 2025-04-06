import { Component, inject } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CalendarComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  /* Injections */
  private readonly _router = inject(Router);

  onSelectDay(dayId: string): void {
    this._router.navigate(['detail', dayId]);
  }
}
