export interface HabitValue {
  Id: number;
  Value: string;
}

export interface HabitLog {
  HabitValues: Array<HabitValue>
  CreatedDateTime: string
}