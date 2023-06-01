import { PlayerInterface } from 'interfaces/player';

export interface DevelopmentGoalInterface {
  id?: string;
  player_id?: string;
  description: string;
  start_date: Date;
  end_date: Date;

  player?: PlayerInterface;
  _count?: {};
}
