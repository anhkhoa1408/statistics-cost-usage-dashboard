import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  DocumentReference,
  Firestore,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../types/user.type';
const COLLECTION_NAME = 'users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userCollection: CollectionReference;

  constructor(private fireStore: Firestore) {
    this.userCollection = collection(this.fireStore, COLLECTION_NAME);
  }

  getAllUsers = (): Observable<User[]> => {
    return collectionData(this.userCollection, { idField: 'id' });
  };

  getUserByEmail = (email: string): Observable<User[]> => {
    const queryClause = query(this.userCollection, where('email', '==', email));
    return collectionData(queryClause, { idField: 'id' });
  };

  addUser = ({ name, email }: Omit<User, 'id'>) => {
    if (!name || !email) return;
    addDoc(this.userCollection, <Omit<User, 'id'>>{ name, email }).then(
      (documentReference: DocumentReference) => {
        console.log('documentReference:', documentReference);
      }
    );
  };
}
