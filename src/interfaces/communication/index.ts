import { UserInterface } from 'interfaces/user';

export interface CommunicationInterface {
  id?: string;
  sender_id?: string;
  receiver_id?: string;
  message: string;
  date_sent: Date;

  user_communication_sender_idTouser?: UserInterface;
  user_communication_receiver_idTouser?: UserInterface;
  _count?: {};
}
