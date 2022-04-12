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

@NgModule({
  imports: [
    BaseModule,
    NzListModule,
    DragDropModule,
    NzTypographyModule,
    NzInputModule,
    NzCheckboxModule,
    NzGridModule,
  ],
  declarations: [TodosComponent],
  providers: [TodosService],
  exports: [TodosComponent],
})
export class TodosModule {}
