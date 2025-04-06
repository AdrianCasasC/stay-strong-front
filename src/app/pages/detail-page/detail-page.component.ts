import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DayDetailService } from '../../services/day-detail.service';
import { getMonthNameByNumber, getNameOfWeek } from '../../utils/calendar';
import { KeyValuePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [KeyValuePipe, ReactiveFormsModule, RouterLink],
  providers: [KeyValuePipe],
  templateUrl: './detail-page.component.html',
  styleUrl: './detail-page.component.scss',
})
export class DetailPageComponent implements OnInit {
  /* Injections */
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _dayDetailService = inject(DayDetailService);
  private readonly _fb = inject(FormBuilder);
  private readonly keyValuePipe = inject(KeyValuePipe);

  /* Signals */
  dayDetail = this._dayDetailService.dayDetail;

  /* Variables */
  dayId: string = '';
  year: number = 0;
  monthName: string = '';
  day: number = 0;
  nameOfWeek: string = '';
  detailForm = this._fb.group({
    calories: [false],
    steps: [false],
    suplementation: [false],
    training: [false],
    weight: [false],
  });

  private initForm(): void {
    const tasks = this.keyValuePipe.transform(this.dayDetail()?.task);
    tasks?.forEach((task) =>
      this.detailForm.get(task.key)?.setValue(task.value)
    );
  }

  constructor() {
    effect(() => {
      if (!this.dayDetail()) return;
      const detailDate = this.dayDetail()!.date;
      const monthNumber = detailDate.getMonth();
      this.year = detailDate.getFullYear();
      this.monthName = getMonthNameByNumber(monthNumber);
      this.day = detailDate.getDate();
      this.nameOfWeek = getNameOfWeek(this.year, monthNumber, this.day);
      this.initForm();
    });
  }

  ngOnInit(): void {
    this.dayId = this._route.snapshot.paramMap.get('id') || '2';
    this._dayDetailService.getDayDetails(this.dayId);
  }

  onToggleCheck(taskName: string): void {
    const currentVal = this.detailForm.get(taskName)?.value;
    this.detailForm.get(taskName)?.setValue(!currentVal);
  }

  onSaveChanges(): void {
    this._router.navigateByUrl('/home');
  }
}
