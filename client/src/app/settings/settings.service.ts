import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, first, Subject } from 'rxjs';

import { Settings } from './utils/types';
import { DbService } from '../core/utils/db.service';
import { EncryptionService } from '../core/utils/encryption.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UpdateKeyPopupComponent } from '../core/components/update-key-popup.component';
import { NzI18nService } from 'ng-zorro-antd/i18n';

@Injectable()
export class SettingsService {
  private readonly collection = 'settings';
  private readonly settings!: Settings;
  private isSynced$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private updateSettings$: Subject<void> = new Subject();
  private isOpen = false;
  private saveInProgress = false;
  readonly settingsReady$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  isUserLogged$ = new BehaviorSubject<boolean | null>(null);

  constructor(
    private db: DbService,
    private modal: NzModalService,
    private encryption: EncryptionService,
    private translationService: NzI18nService
  ) {
    this.settings = this.getLocalSettingsOrDefault();
  }

  setUser(user: Settings['user']) {
    this.settings.user = user;
    this.settings.loggedIn = !!user;
    this.settings.challenge = user ? this.settings.challenge : '';
    this.prepareSettingsUpdateHandler();
    this.saveSettingsLocally();
    this.doSyncSettings();
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

  prepareSettingsUpdateHandler() {
    this.updateSettings$.unsubscribe();
    this.updateSettings$ = new Subject();

    this.updateSettings$.pipe(first()).subscribe(async () => {
      this.settingsReady$.next(false);

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

        if (
          this.encryption.needToUpdateKey(settingsFromDb.challenge) &&
          false === this.isOpen
        ) {
          const { challenge } = await this.forceKeyUpdateModal(
            settingsFromDb.challenge
          );
          this.settings.challenge = challenge;
          this.saveSettingsLocally();
        }

        await this.saveSettingsToDb(true);
      }

      this.settingsReady$.next(true);

      this.isSynced$.next(this.settings.loggedIn); // Need to be false if logged out, for a new sync upon login
    });
  }

  doSyncSettings(): void {
    this.updateSettings$.next();
  }

  async syncSettingsFromDb(): Promise<void> {
    return new Promise((resolve) => {
      this.isSynced$.subscribe({
        next: (isSynced) => {
          if (true === isSynced) {
            resolve();
          }
        },
      });
    });
  }

  async forceKeyUpdateModal(challenge: string): Promise<{ challenge: string }> {
    this.isOpen = true;
    return new Promise((resolve) => {
      const modal = this.modal.create({
        nzTitle: this.translationService.translate('UpdateKeyPopup.title'),
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

  async saveSettingsToDb(forceSettingsReady = false): Promise<void> {
    const isSettingsReady =
      forceSettingsReady || true === this.settingsReady$.getValue();

    if (isSettingsReady && this.settings.loggedIn && !this.saveInProgress) {
      try {
        this.saveInProgress = true;

        return this.db.set(
          this.collection,
          this.settings.user!.id as string,
          this.settings
        );
      } finally {
        this.saveInProgress = false;
      }
    }
  }

  saveSettingsLocally(): void {
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }

  getSettings(): Settings {
    return this.settings;
  }
}
