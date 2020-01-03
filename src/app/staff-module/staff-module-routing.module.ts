import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '../guards/admin.guard';
import { VisitorStudentsComponent } from './visitor-students/visitor-students.component';
import { RoutineComponent } from './routine/routine.component';
import { BatchAssignComponent } from './batch-assign/batch-assign.component';


const routes: Routes = [
  { path: "visitor-students",  component: VisitorStudentsComponent, canActivate: [AdminGuard]},
  { path: "routine-assign",  component: RoutineComponent, canActivate: [AdminGuard]},
  { path: "batch-assign",  component: BatchAssignComponent, canActivate: [AdminGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffModuleRoutingModule { }
