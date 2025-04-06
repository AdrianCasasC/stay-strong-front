interface DayTask {
  steps: boolean;
  calories: boolean;
  training: boolean;
  suplementation: boolean;
  weight: boolean;
}

export interface DetailDay {
  id: string;
  date: Date;
  task: DayTask;
}
