export enum Habit {
  Yoga,
  Code,
  EngineeringProcess,
  Meetings,
  Upskill
}

export const Habits = [
  Habit.Yoga,
  Habit.Code,
  Habit.EngineeringProcess,
  Habit.Meetings,
  Habit.Upskill,
]

export const HabitIds = {
  [Habit.Yoga]: "Yoga",
  [Habit.Code]: "Code",
  [Habit.EngineeringProcess]: "EngineeringProcess",
  [Habit.Meetings]: "Meetings",
  [Habit.Upskill]: "Upskill",
}

export const HabitLabels = {
  [Habit.Yoga]: "Yoga",
  [Habit.Code]: "Code",
  [Habit.EngineeringProcess]: "Engineering Process",
  [Habit.Meetings]: "Meetings",
  [Habit.Upskill]: "Upskill"
}

export const NumberTypeHabits = [
  Habit.Code,
  Habit.EngineeringProcess,
  Habit.Meetings
]

export const BoolTypeHabits = [
  Habit.Yoga,
  Habit.Upskill
]