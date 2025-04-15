import { Component, output } from '@angular/core';
import { Exercise } from '../../models/models';

@Component({
  selector: 'app-exercise-modal',
  standalone: true,
  imports: [],
  templateUrl: './exercise-modal.component.html',
  styleUrl: './exercise-modal.component.scss',
})
export class ExerciseModalComponent {
  /* Outputs */
  onSaveExercise = output<Exercise>();

  onSave(exercise: Exercise): void {
    this.onSaveExercise.emit(exercise);
  }
}
