import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StorageService {
  constructor(
    private http: HttpClient,
    private firebaseStorage: AngularFireStorage
  ) {}

  async uploadRaw(path: string, file: string, hash: string) {
    await this.firebaseStorage.ref(path).putString(file, 'raw', {
      contentType: 'text/plain',
      customMetadata: {
        hash,
      },
    });
  }

  async getMetadata(path: string) {
    return new Promise(async (resolve, reject) => {
      this.firebaseStorage
        .ref(path)
        .getMetadata()
        .subscribe({
          next: (metadata) => {
            resolve(metadata);
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }

  async getRaw(path: string): Promise<string> {
    const downloadUrl = await new Promise((resolve, reject) => {
      this.firebaseStorage
        .ref(path)
        .getDownloadURL()
        .subscribe({
          next: (url) => {
            resolve(url);
          },
          error: (err) => {
            reject(err);
          },
        });
    });

    return new Promise((resolve, reject) => {
      this.http.get(downloadUrl as string, { responseType: 'text' }).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
}
