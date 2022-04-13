// @ts-ignore
import * as cryptoJs from 'crypto-js';
import { Injectable } from '@angular/core';

@Injectable()
export class EncryptionService {
  private key = '';

  getKey() {
    return this.key;
  }

  updateKey(key: string) {
    this.key = key;
  }

  encrypt(value: string) {
    return this.key ? cryptoJs.AES.encrypt(value, this.key).toString() : value;
  }

  decrypt(value: string) {
    return this.key
      ? cryptoJs.AES.decrypt(value, this.key).toString(cryptoJs.enc.Utf8)
      : value;
  }

  randomBytes(length: number) {
    return cryptoJs.lib.WordArray.random(length).toString();
  }
}
