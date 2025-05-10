import { Component, inject, output } from '@angular/core';
import { Exercise } from '../../models/models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-exercise-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './exercise-modal.component.html',
  styleUrl: './exercise-modal.component.scss',
})
export class ExerciseModalComponent {
  /* Injections */
  private readonly _fb = inject(FormBuilder);

  /* Outputs */
  onSaveExercise = output<Exercise>();

  exerciseForm = this._fb.group({
    name: ['', Validators.required],
    series: [0, Validators.min(1)]
  })

  onSave(exercise: Exercise): void {
    this.onSaveExercise.emit(exercise);
  }

  onSubmit(): void {
    if (this.exerciseForm.valid) {
      const exercise: Exercise = {
        name: this.exerciseForm.value.name!,
        series: Array.from({ length: this.exerciseForm.value.series! }, () => ({ repetitions: 0, weight: 0 }))
      }
      console.log('Saved exercise: ', exercise)
      this.onSaveExercise.emit(exercise);
    }
  }
}
