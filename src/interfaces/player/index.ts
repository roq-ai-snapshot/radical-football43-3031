import { DevelopmentGoalInterface } from 'interfaces/development-goal';
import { PerformanceDataInterface } from 'interfaces/performance-data';
import { TrainingExerciseInterface } from 'interfaces/training-exercise';
import { UserInterface } from 'interfaces/user';
import { AcademyInterface } from 'interfaces/academy';

export interface PlayerInterface {
  id?: string;
  user_id?: string;
  academy_id?: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  position: string;
  development_goal?: DevelopmentGoalInterface[];
  performance_data?: PerformanceDataInterface[];
  training_exercise?: TrainingExerciseInterface[];
  user?: UserInterface;
  academy?: AcademyInterface;
  _count?: {
    development_goal?: number;
    performance_data?: number;
    training_exercise?: number;
  };
}
