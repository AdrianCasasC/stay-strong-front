import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DayDetailService } from '../../services/day-detail.service';
import { getMonthNameByNumber, getNameOfWeek } from '../../utils/calendar';
import { KeyValuePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CalendarService } from '../../services/calendar.service';
import { DetailDay, DetailDayEntity } from '../../models/models';
import { getDateString } from '../../../utils/utils';

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
  private readonly _calendarService = inject(CalendarService);
  private readonly _fb = inject(FormBuilder);
  private readonly keyValuePipe = inject(KeyValuePipe);

  /* Signals */
  dayDetail = this._calendarService.dayDetail;
  isLoading = this._calendarService.isLoading;

  /* Variables */
  dayId: string = '';
  year: number = 0;
  monthName: string = '';
  monthNumber: number = 0;
  day: number = 0;
  nameOfWeek: string = '';
  dayDate: string = '';
  detailForm = this._fb.group({
    calories: [false],
    steps: [false],
    suplementation: [false],
    training: [false],
    weight: [false],
  });

  private initForm(): void {
    const tasks = this.keyValuePipe.transform(this.dayDetail()?.tasks);
    tasks?.forEach((task) =>
      this.detailForm.get(task.key)?.setValue(task.value)
    );
  }

  constructor() {
    effect(() => {
      const detailDate = this.dayDetail()?.date
        ? this.dayDetail()!.date
        : new Date(this.dayDate);
      this.year = detailDate!.getFullYear();
      this.monthNumber = detailDate!.getMonth();
      this.monthName = getMonthNameByNumber(this.monthNumber);
      this.day = detailDate!.getDate();
      this.nameOfWeek = getNameOfWeek(this.year, this.monthNumber, this.day);
      this.initForm();
    });
  }

  ngOnInit(): void {
    this.dayId = this._route.snapshot.paramMap.get('dayId') || '';
    const paramDayDate = this._route.snapshot.paramMap.get('dayDate') || '';
    if (paramDayDate) {
      this.dayDate = paramDayDate;
    }
    this._calendarService.getDayDetails(this.dayId);
  }

  onToggleCheck(taskName: string): void {
    const currentVal = this.detailForm.get(taskName)?.value;
    this.detailForm.get(taskName)?.setValue(!currentVal);
  }

  onSaveChanges(): void {
    const updatedDay: DetailDayEntity = {
      date: this.dayDetail()?.date
        ? getDateString(this.dayDetail()!.date!)
        : this.dayDate,
      tasks: {
        steps: this.detailForm.get('steps')?.value || false,
        calories: this.detailForm.get('calories')?.value || false,
        training: this.detailForm.get('training')?.value || false,
        suplementation: this.detailForm.get('suplementation')?.value || false,
        weight: this.detailForm.get('weight')?.value || false,
      },
    };
    if (this.dayId) {
      updatedDay.id = this.dayId;
      this._calendarService
        .updateDayDetail(
          this.year,
          this.monthNumber + 1,
          this.dayId,
          updatedDay
        )
        .subscribe({
          next: () => this._router.navigateByUrl('/home'),
          error: () => console.log('Ha ocurrido un error al editar el día'),
        });
    } else {
      this._calendarService
        .createDayDetail(this.year, this.monthNumber + 1, updatedDay)
        .subscribe({
          next: () => this._router.navigateByUrl('/home'),
          error: () => console.log('Ha ocurrido un error al crear el día'),
        });
    }
  }
}
