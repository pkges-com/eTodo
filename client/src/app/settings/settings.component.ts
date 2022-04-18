import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subject, takeUntil } from 'rxjs';
import { NzDropDownDirective } from 'ng-zorro-antd/dropdown';

import { SettingsService } from './settings.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements AfterViewInit, OnDestroy {
  @ViewChild(NzDropDownDirective) private dropdown!: NzDropDownDirective;
  isMenuOpen = false;
  isLoading = false;
  private destroy$ = new Subject();

  constructor(
    private settingsService: SettingsService,
    private firebaseAuth: AngularFireAuth
  ) {}

  ngAfterViewInit(): void {
    this.listenUserChanges();

    this.dropdown.nzVisibleChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        this.isMenuOpen = event;
      });
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

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
