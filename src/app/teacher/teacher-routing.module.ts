import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutinesComponent } from './routines/routines.component';
import { TeacherGuard } from '../guards/teacher.guard';
import { AttendanceComponent } from './attendance/attendance.component';


const routes: Routes = [
  { path: "teacher-routine", component: RoutinesComponent, canActivate: [TeacherGuard]},
  { path: "teacher-attendance", component: AttendanceComponent, canActivate: [TeacherGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
