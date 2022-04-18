import { Component, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { EncryptionService } from '../utils/encryption.service';

@Component({
  selector: 'nz-modal-custom-component',
  template: `
    <form (ngSubmit)="submitForm()">
      <span *ngIf="challenge">
        על מנת להתחבר בהצלחה, נא להזין את הקוד הזנת בעבר להצפנת ה-Todo שלך
      </span>
      <span *ngIf="!challenge">
        נא להזין קוד שבעזרתו נוכל להצפין את רשימת ה-Todo שלך
      </span>
      <nz-input-group class="key-input" [nzPrefix]="prefixTemplateUser">
        <input id="key" name="key" type="password" nz-input [(ngModel)]="key" />
      </nz-input-group>
      <ng-template #prefixTemplateUser
        ><i nz-icon nzType="lock"></i
      ></ng-template>

      <span *ngIf="invalidMessage" nz-typography nzType="danger">{{
        invalidMessage
      }}</span>

      <div class="actions">
        <button type="submit" nz-button nzType="primary">שמירה</button>
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
    let challenge = '';
    this.invalidMessage = '';

    if (3 > this.key.trim().length) {
      this.invalidMessage = 'נא להזין קוד של לפחות 3 תווים';
      return;
    }

    this.encryption.updateKey(this.key);

    if (this.challenge) {
      const decription = this.encryption.decrypt(this.challenge);
      if ('challenge' !== decription) {
        this.invalidMessage = 'קוד לא תקין, נא לנסות שוב';

        return;
      }
    } else {
      challenge = this.encryption.encrypt('challenge');
    }

    this.modal.destroy({ challenge });
  }
}
