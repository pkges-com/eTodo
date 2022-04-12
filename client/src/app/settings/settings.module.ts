import { NgModule } from '@angular/core';

import { SettingsComponent } from './settings.component';
import { BaseModule } from '../core/base.module';
import { NzListModule } from 'ng-zorro-antd/list';
import { SettingsService } from './settings.service';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { FirebaseUIModule } from 'firebaseui-angular';

@NgModule({
  imports: [
    BaseModule,
    NzListModule,
    NzTypographyModule,
    NzInputModule,
    NzCheckboxModule,
    NzDropDownModule,
    NzGridModule,
    FirebaseUIModule,
  ],
  declarations: [SettingsComponent],
  providers: [SettingsService],
  exports: [SettingsComponent],
})
export class SettingsModule {}
