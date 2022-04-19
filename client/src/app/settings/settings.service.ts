import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Settings } from './utils/types';
import { DbService } from '../core/utils/db.service';
import { EncryptionService } from '../core/utils/encryption.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UpdateKeyPopupComponent } from '../core/components/update-key-popup.component';

@Injectable()
export class SettingsService {
  private readonly collection = 'settings';
  private readonly settings!: Settings;
  private isOpen = false;
  isUserLogged$ = new BehaviorSubject(false);

  constructor(
    private db: DbService,
    private modal: NzModalService,
    private encryption: EncryptionService
  ) {
    this.settings = this.getLocalSettingsOrDefault();
  }

  setUser(user: Settings['user']) {
    this.settings.user = user;
    this.settings.loggedIn = !!user;
    this.saveSettingsLocally();
    this.syncSettingsFromDb();
    this.isUserLogged$.next(this.settings.loggedIn);
  }

  getLocalSettingsOrDefault(): Settings {
    const localSettings = localStorage.getItem('settings');

    return localSettings
      ? JSON.parse(localSettings)
      : {
          locale: 'en',
          user: null,
          loggedIn: false,
          challenge: null,
          darkMode: false,
        };
  }

  async syncSettingsFromDb(): Promise<void> {
    let settingsFromDb = null;

    if (this.settings.loggedIn) {
      try {
        settingsFromDb =
          (await this.db.get(
            this.collection,
            this.settings.user!.id as string
          )) ?? this.settings;
      } catch (e) {
        // No settings on db yet, let's create them
        settingsFromDb = this.settings;
      }
      await this.saveSettingsToDb();

      if (
        this.encryption.needToUpdateKey(settingsFromDb.challenge) &&
        false === this.isOpen
      ) {
        const { challenge } = await this.forceKeyUpdateModal(
          settingsFromDb.challenge
        );
        this.settings.challenge = challenge;
        this.saveSettingsToDb();
        this.saveSettingsLocally();
      }
    }
  }

  async forceKeyUpdateModal(challenge: string): Promise<{ challenge: string }> {
    this.isOpen = true;
    return new Promise((resolve) => {
      const modal = this.modal.create({
        nzTitle: 'Challenge',
        nzContent: UpdateKeyPopupComponent,
        nzComponentParams: {
          challenge,
        },
        nzMaskClosable: false,
        nzCancelDisabled: true,
        nzClosable: false,
        nzKeyboard: false,
        nzFooter: null,
      });

      modal.afterClose.subscribe((result) => {
        this.isOpen = false;
        resolve(result);
      });
    });
  }

  async saveSettingsToDb(): Promise<void> {
    if (this.settings.loggedIn) {
      return this.db.set(
        this.collection,
        this.settings.user!.id as string,
        this.settings
      );
    }
  }

  saveSettingsLocally(): void {
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }

  getSettings(): Settings {
    return this.settings;
  }
}
