import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TeacherRoutingModule } from './teacher-routing.module';
import { StaffModuleModule } from '../staff-module/staff-module.module';
import { RoutinesComponent } from './routines/routines.component';


@NgModule({
  declarations: [
    RoutinesComponent
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot(),
    StaffModuleModule,
    NgbModule
  ]
})
export class TeacherModule { }
