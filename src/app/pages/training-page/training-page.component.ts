import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { ModalComponent } from '../../components/modal/modal.component';
import { Exercise, Serie } from '../../models/models';
import { TrainingService } from '../../services/training.service';
import { DayDetailService } from '../../services/day-detail.service';
import { CalendarService } from '../../services/calendar.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-training-page',
  standalone: true,
  imports: [ModalComponent, ReactiveFormsModule, LoaderComponent, FormsModule],
  templateUrl: './training-page.component.html',
  styleUrl: './training-page.component.scss',
})
export class TrainingPageComponent {
  /* Injections */
  private readonly _dayDetailService = inject(DayDetailService);
  private readonly _trainingService = inject(TrainingService);
  private readonly _calendarService = inject(CalendarService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _fb = inject(FormBuilder);

  /* Signals */
  dayDetail = this._calendarService.dayDetail;
  exercises = computed(() => this.dayDetail()?.training?.exercises)
  dayIdVal = this._dayDetailService.dayIdVal;
  trainingLoading = this._trainingService.loading;

  /* Variables */
  selectedFile: File | null = null;
  trainingName = '';
  trainingNameErr: string | null = null;
  showExerciseModal = false;
  isEditing = false;

  /* Form */
  seriesForm = this._fb.group({
    repetitions: [0, Validators.min(1)],
    weight: [0]
  });

  exerciseForm = this._fb.group({
    name: ['', Validators.required],
    series: this._fb.array([])
  });

  trainingForm = this._fb.group({
    exercises: this._fb.array([])
  });

  /* Modal Form */
  exerciseModalForm = this._fb.group({
    trainingName: ['', [Validators.required]],
    name: ['', [Validators.required]],
    series: [null, [Validators.required, Validators.min(1), Validators.max(10)]]
  })
  
  get formExercises(): FormArray {
    return this.trainingForm.get('exercises') as FormArray;
  }

  getFormSeries(form: AbstractControl<any, any>): FormArray {
    return form.get('series') as FormArray;
  }

  getFormGroup(form: AbstractControl<any, any>): FormGroup {
    return form as FormGroup;
  }

  private getSeriesForm(serie: Serie): FormGroup {
    return this._fb.group({
      repetitions: [serie.repetitions, Validators.min(1)],
      weight: [serie.weight]
    });
  }

  private getExerciseForm(exercise: Exercise): FormGroup {
    return this._fb.group({
      name: [exercise.name, Validators.required],
      series: this._fb.array(exercise.series.map(serie => this.getSeriesForm(serie)))
    })
  }
  
  private fillForm(exercises: Exercise[] | null | undefined): void {
    if (!exercises) return;
    exercises.forEach(exercise => {
      this.formExercises.push(this.getExerciseForm(exercise))
    });
  }

  private clearTrainingNameValidators(): void {
    const trainingNameControl = this.exerciseModalForm.get('trainingName')
    trainingNameControl?.clearValidators();
    trainingNameControl?.updateValueAndValidity();
  }

  constructor() {
    effect(() => {
      this.fillForm(this.exercises() || []);
    });

    effect(() => {
        this.trainingName = this.dayDetail()?.training?.name || '';
        this.clearTrainingNameValidators();
      }
    )
  }

  onOpenExerciseModal(): void {
    this.showExerciseModal = true;
  }

  onSaveExercise(exercise: Exercise): void {
    this.formExercises.push(this.getExerciseForm(exercise));
    this.showExerciseModal = false;
  }

  onSaveTraining(): void {
    //if (!this.trainingForm.valid) return;
    const exercises: Exercise[] = this.trainingForm.value.exercises as Exercise[];
    this._trainingService
      .updateDayExercise(this.dayIdVal(), {
        name: this.trainingName,
        exercises
      })
      .subscribe({
        next: () => {
          this._notificationService.createNotification({
            icon: 'success',
            type: 'success',
            message: '¡Entrenamiento guardado!'
          });
          //this._calendarService.getDayDetails(this._dayDetailService.dayIdVal());
        },
        error: () => this._notificationService.createNotification({
          icon: 'error',
          type: 'error',
          message: 'Error al guardar entrenamiento',
        }),
        complete: () => this._trainingService.setLoading(false)
      });
  }

  onCloseModal(): void {
    this.showExerciseModal = false;
  }

  onEditExercises(): void {
    if (this.formExercises.controls.length) {
      this.isEditing = true;
    }
  }

  onConfirmEditing(): void {
    if (!this.trainingName) {
      this.trainingNameErr = 'Introduce el nombre del entrenamiento';
      return;
    }
    this.trainingNameErr = null;
    this.isEditing = false;
  }

  /* Modal Methods */
  onSubmit(): void {
    if (!this.exerciseModalForm.valid) return;
    if (this.exerciseModalForm.value.trainingName) {
      this.trainingName = this.exerciseModalForm.value.trainingName
    }
    const exercise: Exercise = {
      name: this.exerciseModalForm.value.name!,
      series: Array.from({ length: this.exerciseModalForm.value.series! }, () => ({ repetitions: 0, weight: 0 }))
    }
    this.clearTrainingNameValidators();
    this.exerciseModalForm.reset();
    this.onSaveExercise(exercise);
  }

}
