import { NgModule } from '@angular/core';

import { StaffModuleRoutingModule } from './staff-module-routing.module';
import { BatchAssignComponent } from './batch-assign/batch-assign.component';
import { IonicModule } from '@ionic/angular';
import { NotificationComponent } from './notification/notification.component';
import { RoutineComponent } from './routine/routine.component';
import { VisitorStudentsComponent } from './visitor-students/visitor-students.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BatchListComponent } from './batch-list/batch-list.component';
import { BatchEditComponent } from './batch-edit/batch-edit.component';


@NgModule({
  declarations: [
    VisitorStudentsComponent,
    BatchAssignComponent,
    BatchListComponent,
    BatchEditComponent,
    RoutineComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot(),
    StaffModuleRoutingModule
  ],
  exports: [NotificationComponent]
})
export class StaffModuleModule { }
