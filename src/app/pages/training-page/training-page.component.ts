import { Component, inject, OnInit } from '@angular/core';
import { ExerciseModalComponent } from '../../components/exercise-modal/exercise-modal.component';
import { Exercise } from '../../models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingService } from '../../services/training.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { DayDetailService } from '../../services/day-detail.service';

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

  /* Signals */
  exercises = this._trainingService.exercises;

  dayIdVal = this._dayDetailService.dayIdVal;

  /* Variables */

  trainingName = 'Pierna';
  showExerciseModal = false;
  draftExercises: Exercise[] = [];

  ngOnInit(): void {
    this._trainingService.getDayExercises(this.dayIdVal());
  }

  onOpenExerciseModal(): void {
    this.showExerciseModal = true;
  }

  onSaveExercise(exercise: Exercise): void {
    this.draftExercises.push(exercise);
  }

  onSaveTraining(): void {
    this._trainingService
      .saveDayExercises(this.dayIdVal(), this.draftExercises)
      .subscribe({
        next: () => this._router.navigateByUrl('/home'),
      });
  }
}
