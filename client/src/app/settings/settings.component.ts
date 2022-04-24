import {
  AfterViewInit,
  Component,
  HostBinding,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subject, takeUntil } from 'rxjs';
import { NzDropDownDirective } from 'ng-zorro-antd/dropdown';

import { SettingsService } from './settings.service';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import {
  getLocaleByLanguageCode,
  Language,
  LanguageToDirection,
} from '../core/translations';
import { EncryptionService } from '../core/utils/encryption.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements AfterViewInit, OnDestroy {
  @ViewChild(NzDropDownDirective) private dropdown!: NzDropDownDirective;
  @HostBinding('dir') get direction(): string {
    return this.settings.rtl ? 'rtl' : 'ltr';
  }
  isMenuOpen = false;
  isLoading = false;
  languageCodes = Object.values(Language);
  themeStyleElement: HTMLLinkElement = document.createElement('link');
  private destroy$ = new Subject();

  constructor(
    private settingsService: SettingsService,
    private firebaseAuth: AngularFireAuth,
    private translationService: NzI18nService,
    private encryptionService: EncryptionService
  ) {}

  ngAfterViewInit(): void {
    this.listenUserChanges();

    this.dropdown.nzVisibleChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        this.isMenuOpen = event;
      });

    this.initSettings();

    this.themeStyleElement.rel = 'stylesheet';
    document.head.append(this.themeStyleElement);
  }

  changeLocale(): void {
    this.translationService.setLocale(
      getLocaleByLanguageCode(this.settings.locale)
    );
    this.onSettingsChange();
  }

  async onSettingsChange(): Promise<void> {
    this.settingsService.saveSettingsLocally();
    await this.settingsService.saveSettingsToDb();
  }

  logOut(): void {
    this.isLoading = true;
    this.firebaseAuth.signOut().then(() => {
      this.isLoading = false;
    });
  }

  listenUserChanges(): void {
    this.firebaseAuth.authState.subscribe(
      (user) => {
        const userObj = user?.toJSON?.() as any;

        if (userObj) {
          this.settingsService.setUser(
            JSON.parse(
              // Remove undefined values
              JSON.stringify({
                id: userObj.uid,
                name: userObj.displayName,
                email: userObj.email,
                phone: userObj.phoneNumber,
                isAdmin: false,
              })
            )
          );
        } else {
          this.encryptionService.updateKey('');
          this.settingsService.setUser(null);
        }
      },
      (error) => {
        console.error(error);
      },
      () => {
        if (this.isLoading) {
          this.isLoading = false;
        }
      }
    );
  }

  get settings() {
    return this.settingsService.getSettings();
  }

  get currentLocale(): string {
    return this.translationService.getLocale().locale;
  }

  toggleLanguage(language: Language): void {
    this.settings.locale = language;
    this.translationService.setLocale(getLocaleByLanguageCode(language));
    this.settings.rtl = 'rtl' === LanguageToDirection[language];
    this.updateDirection();
    this.saveSettings();
  }

  updateTheme(): void {
    this.themeStyleElement.href = `/themes/ng-zorro-antd${
      this.settings.darkMode ? '.dark' : ''
    }.min.css`;
    this.saveSettings();
  }

  async initSettings(): Promise<void> {
    this.toggleLanguage(this.settings.locale);
    this.updateTheme();
  }

  saveSettings(): void {
    this.settingsService.saveSettingsLocally();
    this.settingsService.saveSettingsToDb();
  }

  updateDirection(): void {
    document.body.dir = this.direction;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
