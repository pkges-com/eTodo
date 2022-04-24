import { NgModule } from '@angular/core';

import { TodosComponent } from './todos.component';
import { BaseModule } from '../core/base.module';
import { NzListModule } from 'ng-zorro-antd/list';
import { TodosService } from './todos.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { StorageService } from '../core/utils/storage.service';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  imports: [
    BaseModule,
    NzListModule,
    DragDropModule,
    NzTypographyModule,
    NzInputModule,
    NzCheckboxModule,
    NzButtonModule,
    NzGridModule,
  ],
  declarations: [TodosComponent],
  providers: [TodosService, StorageService],
  exports: [TodosComponent],
})
export class TodosModule {}
