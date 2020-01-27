import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentGuard } from '../guards/student.guard';
import { RoutineDetailsComponent } from './routine-details/routine-details.component';


const routes: Routes = [
  { path: "student-routine", component: RoutineDetailsComponent, canActivate: [StudentGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActiveStudentRoutingModule { }
