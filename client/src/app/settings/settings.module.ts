import { NgModule } from '@angular/core';

import { SettingsComponent } from './settings.component';
import { BaseModule } from '../core/base.module';
import { NzListModule } from 'ng-zorro-antd/list';
import { SettingsService } from './settings.service';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { FirebaseUIModule } from 'firebaseui-angular';
import { UpdateKeyPopupComponent } from '../core/components/update-key-popup.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DbService } from '../core/utils/db.service';

@NgModule({
  imports: [
    BaseModule,
    NzListModule,
    NzTypographyModule,
    NzInputModule,
    NzCheckboxModule,
    NzDropDownModule,
    NzButtonModule,
    NzGridModule,
    NzSwitchModule,
    FirebaseUIModule,
  ],
  declarations: [SettingsComponent, UpdateKeyPopupComponent],
  providers: [SettingsService, DbService],
  exports: [SettingsComponent],
})
export class SettingsModule {}
