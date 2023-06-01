import { PlayerInterface } from 'interfaces/player';

export interface PerformanceDataInterface {
  id?: string;
  player_id?: string;
  data_type: string;
  value: number;
  date: Date;

  player?: PlayerInterface;
  _count?: {};
}
