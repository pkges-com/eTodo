import { Injectable } from '@angular/core';
import { Settings } from './utils/types';
import { UtilsService } from '../core/utils.service';

@Injectable()
export class SettingsService {
  private readonly settings!: Settings;

  constructor() {
    const localSettings = localStorage.getItem('settings');
    this.settings = localSettings
      ? JSON.parse(localSettings)
      : { locale: 'en', user: null, loggedIn: false, darkMode: false };
  }

  setUser(user: Settings['user']) {
    this.settings.user = user;
    this.settings.loggedIn = !!user;
  }

  getSettings(): Settings {
    return this.settings;
  }
}
