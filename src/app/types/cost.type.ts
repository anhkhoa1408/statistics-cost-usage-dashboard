import { DocumentReference, Timestamp } from '@angular/fire/firestore';

export interface Cost {
  date: Timestamp;
  amount: number;
  purpose: DocumentReference | null;
  type: string;
  payer: DocumentReference | null;
}
