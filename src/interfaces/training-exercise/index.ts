import { CoachInterface } from 'interfaces/coach';
import { PlayerInterface } from 'interfaces/player';

export interface TrainingExerciseInterface {
  id?: string;
  coach_id?: string;
  player_id?: string;
  description: string;
  date_assigned: Date;
  date_due: Date;
  status: string;

  coach?: CoachInterface;
  player?: PlayerInterface;
  _count?: {};
}
