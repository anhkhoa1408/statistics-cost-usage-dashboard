import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  DocumentReference,
  Firestore,
  getDoc,
  orderBy,
  Query,
  query,
  where,
} from '@angular/fire/firestore';
import moment from 'moment';
import { from, mergeMap, Observable } from 'rxjs';
import { Cost } from './../types/cost.type';

const COLLECTION_NAME = 'costs';

@Injectable({
  providedIn: 'root',
})
export class CostService {
  costCollection: CollectionReference;

  constructor(private fireStore: Firestore) {
    this.costCollection = collection(this.fireStore, COLLECTION_NAME);
  }

  queryCosts = (queryClause: Query): Observable<Cost[]> => {
    return collectionData(queryClause).pipe(
      mergeMap((costs: Cost[]) => {
        const costWithPromise = costs.map(async (cost, index) => {
          let payer, payerDoc, purpose, purposeDoc;
          if (cost.payer) {
            payerDoc = await getDoc(cost.payer);
            payer = {
              id: payerDoc.id,
              ...payerDoc.data(),
            };
          }
          if (cost.purpose) {
            purposeDoc = await getDoc(cost.purpose);
            purpose = {
              id: purposeDoc.id,
              ...purposeDoc.data(),
            };
          }
          return {
            ...cost,
            id: index + 1,
            payer,
            purpose,
            date: moment(cost.date.toDate()).format('DD/MM/YYYY HH:mm:ss'),
          };
        });
        return from(Promise.all(costWithPromise));
      })
    );
  };

  getAllCost = () => {
    const queryClause = query(this.costCollection, orderBy('date', 'desc'));
    return this.queryCosts(queryClause);
  };

  getCostsInCurMonth = () => {
    const queryClause = query(
      this.costCollection,
      where(
        'date',
        '>=',
        moment()
          .set('month', moment().get('month') - 1)
          .toDate()
      ),
      orderBy('date', 'desc')
    );
    return this.queryCosts(queryClause);
  };

  createCost = async ({ amount, date, purpose, type, payer }: Cost) => {
    if (!amount || !date || !purpose || !type) return;

    await addDoc(this.costCollection, <Cost>{
      amount,
      date,
      purpose,
      type,
      payer,
    });
  };
}
