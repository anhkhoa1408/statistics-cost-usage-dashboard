import { DocumentReference, Timestamp } from '@angular/fire/firestore';

export interface Cost {
  shortDate: string;
  date: Timestamp;
  amount: number;
  purpose: DocumentReference | null;
  type: string;
  payer: DocumentReference | null;
}
