import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  DocumentReference,
  Firestore,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Purpose } from '../types/purpose.type';
const COLLECTION_NAME = 'purposes';

@Injectable({
  providedIn: 'root',
})
export class PurposeService {
  purposeCollection: CollectionReference;

  constructor(private fireStore: Firestore) {
    this.purposeCollection = collection(this.fireStore, COLLECTION_NAME);
  }

  getAllPurposes = (): Observable<Purpose[]> => {
    return collectionData(this.purposeCollection, { idField: 'id' });
  };

  addPurpose = ({ name }: Omit<Purpose, 'id'>) => {
    if (!name) return;
    addDoc(this.purposeCollection, <Omit<Purpose, 'id'>>{ name }).then(
      (documentReference: DocumentReference) => {
        console.log('documentReference:', documentReference);
      }
    );
  };
}
