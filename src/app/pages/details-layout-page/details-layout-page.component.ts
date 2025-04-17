import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { DayDetailService } from '../../services/day-detail.service';

@Component({
  selector: 'app-details-layout-page',
  standalone: true,
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './details-layout-page.component.html',
  styleUrl: './details-layout-page.component.scss',
})
export class DetailsLayoutPageComponent implements OnInit {
  /* Injections */
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _dayDetailService = inject(DayDetailService);

  dayId = '';
  dayDate = '';

  ngOnInit(): void {
    this.dayId = this._route.snapshot.paramMap.get('dayId') || '';
    this.dayDate = this._route.snapshot.paramMap.get('dayDate') || '';
    this._dayDetailService.dayId = this.dayId;
    this._dayDetailService.dayDate = this.dayDate;
    this._router.navigate([
      'details',
      this._dayDetailService.dayIdVal(),
      this._dayDetailService.dayDateVal(),
      'list',
    ]);
  }
}
