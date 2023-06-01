import { TrainingExerciseInterface } from 'interfaces/training-exercise';
import { UserInterface } from 'interfaces/user';
import { AcademyInterface } from 'interfaces/academy';

export interface CoachInterface {
  id?: string;
  user_id?: string;
  academy_id?: string;
  first_name: string;
  last_name: string;
  training_exercise?: TrainingExerciseInterface[];
  user?: UserInterface;
  academy?: AcademyInterface;
  _count?: {
    training_exercise?: number;
  };
}
