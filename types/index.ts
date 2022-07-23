import { Timestamp } from 'firebase/firestore';

export interface Conversation {
  users: string[];
}

export interface AppUser {
  displayName: string;
  email: string;
  lastSeen: Timestamp;
  photoUrl: string;
}

export interface IMessage {
  id: string;
  conversation_id: string;
  text: string;
  sent_at: string;
  user: string;
}
