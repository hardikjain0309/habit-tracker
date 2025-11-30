export interface HabitValue {
  Id: number;
  Value: string;
}

export interface HabitLog {
  Habits: Array<HabitValue>
  CreatedDateTime: number
}