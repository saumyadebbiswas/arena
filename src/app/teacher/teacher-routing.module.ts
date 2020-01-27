import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutinesComponent } from './routines/routines.component';
import { TeacherGuard } from '../guards/teacher.guard';


const routes: Routes = [
  { path: "teacher-routine", component: RoutinesComponent, canActivate: [TeacherGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
