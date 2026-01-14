
export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  load: string;
  rest: string;
  obs?: string;
}

export interface DayWorkout {
  title: string;
  duration: string;
  exercises: Exercise[];
  cardio?: {
    duration: string;
    intensity: string;
    hr: string;
  };
}

export interface Phase {
  id: number;
  name: string;
  weeks: string;
  frequency: string;
  objective: string;
  workouts: DayWorkout[];
}

export interface Macro {
  label: string;
  amount: string;
  calories: string;
  percentage: string;
  color: string;
}

export interface Meal {
  title: string;
  percentage: string;
  options: string[];
}

export interface StrengthRecord {
  exercise: string;
  current: number;
  pb: number;
  initial: number;
  history: { week: number; weight: number }[];
}

export interface LogEntry {
  sets: string;
  reps: string;
  load: string;
}

export interface HistoricalEntry extends LogEntry {
  date: string;
}
