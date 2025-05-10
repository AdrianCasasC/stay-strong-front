import { Component, computed, inject, OnInit } from '@angular/core';
import { ExerciseModalComponent } from '../../components/exercise-modal/exercise-modal.component';
import { Exercise } from '../../models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingService } from '../../services/training.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { DayDetailService } from '../../services/day-detail.service';
import { CalendarService } from '../../services/calendar.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-training-page',
  standalone: true,
  imports: [ExerciseModalComponent, FooterComponent],
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
