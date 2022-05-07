import { Component, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
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

      <div class="actions">
        <button type="submit" nz-button nzType="primary">
          {{ 'UpdateKeyPopup.save' | translate }}
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .key-input {
        margin-top: 16px;
      }
      #key {
        direction: ltr;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 16px;
      }
    `,
  ],
})
export class UpdateKeyPopupComponent {
  @Input() challenge?: string;
  invalidMessage: string = '';
  key: string = '';

  constructor(
    private modal: NzModalRef,
    private encryption: EncryptionService
  ) {}

  destroyModal(): void {
    this.modal.destroy({ data: 'this the result data' });
  }

  async submitForm() {
    let newChallenge = this.challenge ?? '';
    this.invalidMessage = '';

    if (3 > this.key.trim().length) {
      this.invalidMessage = 'UpdateKeyPopup.invalid_key';
      return;
    }

    this.encryption.updateKey(this.key);

    if (newChallenge) {
      const decription = this.encryption.decrypt(newChallenge);
      if ('challenge' !== decription) {
        this.invalidMessage = 'UpdateKeyPopup.incorrect_key';

        return;
      }
    } else {
      newChallenge = this.encryption.encrypt('challenge');
    }

    this.modal.destroy({ challenge: newChallenge });
  }
}
