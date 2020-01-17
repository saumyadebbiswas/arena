import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '../guards/admin.guard';
import { VisitorStudentsComponent } from './visitor-students/visitor-students.component';
import { RoutineComponent } from './routine/routine.component';
import { BatchAssignComponent } from './batch-assign/batch-assign.component';
import { BatchListComponent } from './batch-list/batch-list.component';
import { BatchEditComponent } from './batch-edit/batch-edit.component';
import { ActiveStudentsComponent } from './active-students/active-students.component';


const routes: Routes = [
  { path: "visitor-students",  component: VisitorStudentsComponent, canActivate: [AdminGuard]},
  { path: "active-students",  component: ActiveStudentsComponent, canActivate: [AdminGuard]},
  { path: "batch-assign",  component: BatchAssignComponent, canActivate: [AdminGuard]},
  { path: "batch-list",  component: BatchListComponent, canActivate: [AdminGuard]},
  { path: "batch-edit",  component: BatchEditComponent, canActivate: [AdminGuard]},
  { path: "routine-assign",  component: RoutineComponent, canActivate: [AdminGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffModuleRoutingModule { }
