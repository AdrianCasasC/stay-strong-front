import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DayDetailService } from '../../services/day-detail.service';
import { getMonthNameByNumber, getNameOfWeek } from '../../utils/calendar';
import { KeyValuePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CalendarService } from '../../services/calendar.service';
import { DetailDay, DetailDayEntity } from '../../models/models';
import { getDateString } from '../../../utils/utils';
import { FooterComponent } from '../../components/footer/footer.component';
import { DetailsLayoutPageComponent } from '../details-layout-page/details-layout-page.component';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [KeyValuePipe, ReactiveFormsModule, RouterLink, FooterComponent],
  providers: [KeyValuePipe],
  templateUrl: './detail-page.component.html',
  styleUrl: './detail-page.component.scss',
})
export class DetailPageComponent implements OnInit {
  /* Injections */
  private readonly _router = inject(Router);
  private readonly _dayDetailService = inject(DayDetailService);
  private readonly _calendarService = inject(CalendarService);
  private readonly _fb = inject(FormBuilder);
  private readonly keyValuePipe = inject(KeyValuePipe);

  /* Signals */
  dayDetail = this._calendarService.dayDetail;
  isLoading = this._calendarService.isLoading;

  /* Variables */
  year: number = 0;
  monthName: string = '';
  monthNumber: number = 0;
  day: number = 0;
  nameOfWeek: string = '';
  detailForm = this._fb.group({
    calories: [false],
    steps: [false],
    suplementation: [false],
    training: [false],
    weight: [false],
    weightNumber: this._fb.control<number | null>(null),
  });

  tasksNames = {
    calories: 'Calorias',
    steps: 'Pasos',
    suplementation: 'Suplementación',
    training: 'Entrenamiento',
    weight: 'Peso',
  };

  private initForm(): void {
    const tasks = this.keyValuePipe.transform(this.dayDetail()?.tasks);
    tasks?.forEach((task) =>
      this.detailForm.get(task.key)?.setValue(task.value)
    );
    this.detailForm
      .get('weightNumber')
      ?.setValue(this.dayDetail()?.weightNumber || null);
  }

  constructor() {
    effect(() => {
      const detailDate = this.dayDetail()?.date
        ? this.dayDetail()!.date
        : new Date(this._dayDetailService.dayDateVal());
      this.year = detailDate!.getFullYear();
      this.monthNumber = detailDate!.getMonth();
      this.monthName = getMonthNameByNumber(this.monthNumber);
      this.day = detailDate!.getDate();
      this.nameOfWeek = getNameOfWeek(this.year, this.monthNumber, this.day);
      this.initForm();
    });
  }

  ngOnInit(): void {
    this._calendarService.getDayDetails(this._dayDetailService.dayIdVal());
  }

  onToggleCheck(taskName: string): void {
    const currentVal = this.detailForm.get(taskName)?.value;
    this.detailForm.get(taskName)?.setValue(!currentVal);
  }

  onSaveChanges(): void {
    const updatedDay: DetailDayEntity = {
      date: this.dayDetail()?.date
        ? getDateString(this.dayDetail()!.date!)
        : this._dayDetailService.dayDateVal(),
      tasks: {
        steps: this.detailForm.get('steps')?.value || false,
        calories: this.detailForm.get('calories')?.value || false,
        training: this.detailForm.get('training')?.value || false,
        suplementation: this.detailForm.get('suplementation')?.value || false,
        weight: this.detailForm.get('weight')?.value || false,
      },
      weightNumber: this.detailForm.get('weightNumber')?.value || null,
    };
    if (this._dayDetailService.dayIdVal()) {
      updatedDay.id = this._dayDetailService.dayIdVal();
      this._calendarService
        .updateDayDetail(
          this.year,
          this.monthNumber + 1,
          this._dayDetailService.dayIdVal(),
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
