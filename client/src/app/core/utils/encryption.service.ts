// @ts-ignore
import * as cryptoJs from 'crypto-js';
import { Injectable } from '@angular/core';

@Injectable()
export class EncryptionService {
  private readonly keyName = 'key';
  private key = localStorage.getItem(this.keyName) ?? '';

  getKey() {
    return this.key;
  }

  updateKey(key: string) {
    this.key = key;
    localStorage.setItem(this.keyName, key);
  }

  encrypt(value: string) {
    return this.key ? cryptoJs.AES.encrypt(value, this.key).toString() : value;
  }

  decrypt(value: string) {
    return this.key
      ? cryptoJs.AES.decrypt(value, this.key).toString(cryptoJs.enc.Utf8)
      : value;
  }

  needToUpdateKey(challenge: string): boolean {
    return !challenge || 'challenge' !== this.decrypt(challenge);
  }

  randomBytes(length: number) {
    return cryptoJs.lib.WordArray.random(length).toString();
  }
}
