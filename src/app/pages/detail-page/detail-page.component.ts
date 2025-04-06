import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DayDetailService } from '../../services/day-detail.service';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [],
  templateUrl: './detail-page.component.html',
  styleUrl: './detail-page.component.scss',
})
export class DetailPageComponent implements OnInit {
  /* Injections */
  private readonly _route = inject(ActivatedRoute);
  private readonly _dayDetailService = inject(DayDetailService);

  /* Signals */
  dayDetail = this._dayDetailService.dayDetail;

  /* Variables */
  dayId: string = '';

  ngOnInit(): void {
    this.dayId = this._route.snapshot.paramMap.get('id') || '';
    this._dayDetailService.getDayDetails(this.dayId);
  }
}
