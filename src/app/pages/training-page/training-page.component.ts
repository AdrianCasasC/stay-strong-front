import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { ExerciseModalComponent } from '../../components/exercise-modal/exercise-modal.component';
import { Exercise, Serie } from '../../models/models';
import { Router } from '@angular/router';
import { TrainingService } from '../../services/training.service';
import { DayDetailService } from '../../services/day-detail.service';
import { CalendarService } from '../../services/calendar.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-training-page',
  standalone: true,
  imports: [ExerciseModalComponent, ReactiveFormsModule],
  templateUrl: './training-page.component.html',
  styleUrl: './training-page.component.scss',
})
export class TrainingPageComponent implements OnInit {
  /* Injections */
  private readonly _router = inject(Router);
  private readonly _dayDetailService = inject(DayDetailService);
  private readonly _trainingService = inject(TrainingService);
  private readonly _calendarService = inject(CalendarService);
  private readonly _fb = inject(FormBuilder);

  /* Signals */
  dayDetail = this._calendarService.dayDetail;
  exercises = computed(() => this.dayDetail()?.exercises)
  dayIdVal = this._dayDetailService.dayIdVal;

  /* Variables */
  selectedFile: File | null = null;
  trainingName = 'Pierna';
  showExerciseModal = false;
  isEditing = false;
  draftExercises: Exercise[] = [];

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

  constructor() {
    effect(() => this.fillForm(this.exercises()))
  }

  ngOnInit(): void {
    this._trainingService.getDayExercises(this.dayIdVal());
  }

  onOpenExerciseModal(): void {
    this.showExerciseModal = true;
  }

  onSaveExercise(exercise: Exercise): void {
    this.draftExercises.push(exercise);
    this.showExerciseModal = false;
  }

  onSaveTraining(): void {
    this._trainingService
      .saveDayExercises(this.dayIdVal(), this.draftExercises)
      .subscribe({
        next: () => this._router.navigateByUrl('/home'),
      });
  }

  onCloseModal(): void {
    this.showExerciseModal = false;
  }

  onEditExercises(): void {
    this.isEditing = true;
  }

  onConfirmEditing(): void {
    this.isEditing = false;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
      } else {
        alert('Only PDF files are allowed');
        this.selectedFile = null;
      }
    }
    
  }
}
