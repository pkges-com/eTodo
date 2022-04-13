import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Settings } from './utils/types';

@Injectable()
export class SettingsService {
  private readonly settings!: Settings;
  isUserLogged$ = new BehaviorSubject(false);

  constructor() {
    const localSettings = localStorage.getItem('settings');
    this.settings = localSettings
      ? JSON.parse(localSettings)
      : { locale: 'en', user: null, loggedIn: false, darkMode: false };
  }

  setUser(user: Settings['user']) {
    this.settings.user = user;
    this.settings.loggedIn = !!user;
    this.isUserLogged$.next(this.settings.loggedIn);
  }

  getSettings(): Settings {
    return this.settings;
  }
}
