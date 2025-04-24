export interface Meeting {
  id: string; // ← changed from number
  title: string;
  description: string;
  host: string;
  date: string;
  status: 'upcoming' | 'completed';
  attendees: string[]; // ← changed from number[]
  successStatus: 'successful' | 'failed' | null;
}