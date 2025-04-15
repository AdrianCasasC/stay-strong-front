import { Component, inject, OnInit } from '@angular/core';
import { ExerciseModalComponent } from '../../components/exercise-modal/exercise-modal.component';
import { Exercise } from '../../models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingService } from '../../services/training.service';

@Component({
  selector: 'app-training-page',
  standalone: true,
  imports: [ExerciseModalComponent],
  templateUrl: './training-page.component.html',
  styleUrl: './training-page.component.scss',
})
export class TrainingPageComponent implements OnInit {
  /* Injections */
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _trainingService = inject(TrainingService);

  /* Signals */
  exercises = this._trainingService.exercises;

  dayId = '';
  trainingName = 'Pierna';
  showExerciseModal = false;
  draftExercises: Exercise[] = [];

  ngOnInit(): void {
    this.dayId = this._route.snapshot.paramMap.get('dayId') || '';
    this._trainingService.getDayExercises(this.dayId);
  }

  onOpenExerciseModal(): void {
    this.showExerciseModal = true;
  }

  onSaveExercise(exercise: Exercise): void {
    this.draftExercises.push(exercise);
  }

  onSaveTraining(): void {
    this._trainingService
      .saveDayExercises(this.dayId, this.draftExercises)
      .subscribe({
        next: () => this._router.navigateByUrl('/home'),
      });
  }
}
