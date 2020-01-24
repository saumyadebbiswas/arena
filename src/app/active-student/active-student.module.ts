import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ActiveStudentRoutingModule } from './active-student-routing.module';

import { RoutineDetailsComponent } from './routine-details/routine-details.component';
import { StaffModuleModule } from '../staff-module/staff-module.module';


@NgModule({
  declarations: [
    RoutineDetailsComponent
  ],
  imports: [
    CommonModule,
    ActiveStudentRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot(),
    StaffModuleModule,
    NgbModule
  ]
})
export class ActiveStudentModule { }
