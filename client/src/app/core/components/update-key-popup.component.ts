import { Component, HostBinding, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SettingsService } from 'src/app/settings/settings.service';
import { EncryptionService } from '../utils/encryption.service';

@Component({
  selector: 'nz-modal-custom-component',
  template: `
    <form (ngSubmit)="submitForm()">
      <span *ngIf="challenge">
        {{ 'UpdateKeyPopup.decrypt_description' | translate }}
      </span>
      <span *ngIf="!challenge">
        {{ 'UpdateKeyPopup.encrypt_description' | translate }}
      </span>
      <nz-input-group class="key-input" [nzPrefix]="prefixTemplateUser">
        <input id="key" name="key" type="password" nz-input [(ngModel)]="key" />
      </nz-input-group>
      <ng-template #prefixTemplateUser
        ><i nz-icon nzType="lock"></i
      ></ng-template>

      <span *ngIf="invalidMessage" nz-typography nzType="danger">{{
        invalidMessage | translate
      }}</span>

      <nz-row>
        <label name="override" nz-checkbox [(ngModel)]="isOverride">
          {{ 'UpdateKeyPopup.override_description' | translate }}
        </label>
      </nz-row>
      <nz-row *ngIf="isOverride">
        <nz-alert
          nzShowIcon
          nzMessage="{{ 'UpdateKeyPopup.override_warning' | translate }}"
          nzType="warning"
        ></nz-alert>
      </nz-row>

      <div class="actions">
        <button type="submit" nz-button nzType="primary">
          {{ 'UpdateKeyPopup.save' | translate }}
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 10px;
      }
      #key {
        direction: ltr;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
      }
    `,
  ],
})
export class UpdateKeyPopupComponent {
  @Input() challenge?: string;
  @HostBinding('dir') get isRrtl() {
    return this.settingsService.getSettings().rtl ? 'rtl' : 'ltr';
  }
  invalidMessage: string = '';
  isOverride = false;
  key: string = '';

  constructor(
    private modal: NzModalRef,
    private encryption: EncryptionService,
    private settingsService: SettingsService
  ) {}

  destroyModal(): void {
    this.modal.destroy({ data: 'this the result data' });
  }

  async submitForm() {
    let resultChallenge = this.challenge ?? '';
    this.invalidMessage = '';

    if (3 > this.key.trim().length) {
      this.invalidMessage = 'UpdateKeyPopup.invalid_key';
      return;
    }

    this.encryption.updateKey(this.key);

    if (resultChallenge && !this.isOverride) {
      const decription = this.encryption.decrypt(resultChallenge);
      if ('challenge' !== decription) {
        this.invalidMessage = 'UpdateKeyPopup.incorrect_key';

        return;
      }
    } else {
      resultChallenge = this.encryption.encrypt('challenge');
    }

    this.modal.destroy({
      challenge: resultChallenge,
    });
  }
}
