import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

import { StaffModuleRoutingModule } from './staff-module-routing.module';
import { BatchAssignComponent } from './batch-assign/batch-assign.component';
import { NotificationComponent } from './notification/notification.component';
import { RoutineComponent } from './routine/routine.component';
import { VisitorStudentsComponent } from './visitor-students/visitor-students.component';
import { BatchListComponent } from './batch-list/batch-list.component';
import { BatchEditComponent } from './batch-edit/batch-edit.component';
import { ActiveStudentsComponent } from './active-students/active-students.component';


@NgModule({
  declarations: [
    VisitorStudentsComponent,
    BatchAssignComponent,
    BatchListComponent,
    BatchEditComponent,
    RoutineComponent,
    NotificationComponent,
    ActiveStudentsComponent
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
