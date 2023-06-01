import { UserInterface } from 'interfaces/user';

export interface ParentInterface {
  id?: string;
  user_id?: string;
  first_name: string;
  last_name: string;

  user?: UserInterface;
  _count?: {};
}
