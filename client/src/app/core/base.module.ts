import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { AutofocusDirective } from './utils/autofocus.directive';
import { EncryptionService } from './utils/encryption.service';
import { NzI18nModule } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { TranslationPipe } from './utils/translation.pipe';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NzI18nModule,
    NzModalModule,
    NzSpinModule,
    NzAlertModule,
  ],
  declarations: [AutofocusDirective, TranslationPipe],
  providers: [UtilsService, EncryptionService],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    AutofocusDirective,
    NzI18nModule,
    NzIconModule,
    NzSpinModule,
    NzAlertModule,
    TranslationPipe,
  ],
})
export class BaseModule {}
