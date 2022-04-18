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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NzI18nModule,
    NzModalModule,
  ],
  declarations: [AutofocusDirective],
  providers: [UtilsService, EncryptionService],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    AutofocusDirective,
    NzI18nModule,
    NzIconModule,
  ],
})
export class BaseModule {}
