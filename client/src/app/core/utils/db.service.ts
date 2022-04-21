import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable()
export class DbService {
  constructor(private firestore: AngularFirestore) {}

  async set(
    collection: string,
    key: string,
    payload: Record<string, any>
  ): Promise<any> {
    return this.firestore.collection(collection).doc(key).set(payload);
  }

  async get(collection: string, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firestore
        .collection(collection)
        .doc(key)
        .get()
        .subscribe({
          next: (data) => {
            resolve(data.data());
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }
}
