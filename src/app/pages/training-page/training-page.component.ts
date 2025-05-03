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
  selectedFile: File | null = null;
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

  uploadFile(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this._trainingService.getExercisesTable(formData);
  }
}
