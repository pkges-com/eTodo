// @ts-ignore
import * as cryptoJs from 'crypto-js';
import { Injectable } from '@angular/core';

@Injectable()
export class EncryptionService {
  private key = this.randomBytes(5);

  getKey() {
    return this.key;
  }

  updateKey(key: string) {
    this.key = key;
  }

  encrypt(value: string) {
    return cryptoJs.AES.encrypt(value, this.key).toString();
  }

  decrypt(value: string) {
    return cryptoJs.AES.decrypt(value, this.key).toString(cryptoJs.enc.Utf8);
  }

  randomBytes(length: number) {
    return cryptoJs.lib.WordArray.random(length).toString();
  }
}
