import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PlacementrecordComponent } from './placementrecord/placementrecord.component';
import { VideosComponent } from './videos/videos.component';
import { InfrestComponent } from './infrest/infrest.component';
import { WorkComponent } from './work/work.component';
import { CoursedetailsComponent } from './coursedetails/coursedetails.component';
import { CourseComponent } from './course/course.component';
import { ApplicationformComponent } from './applicationform/applicationform.component';
import { StudentGuard } from './guards/student.guard';
import { AdminGuard } from './guards/admin.guard';
import { ApplicationeducationComponent } from './applicationeducation/applicationeducation.component';
import { ApplicationactivitiesComponent } from './applicationactivities/applicationactivities.component';
import { ApplicationofficeComponent } from './applicationoffice/applicationoffice.component';
import { ApplicationfinishComponent } from './applicationfinish/applicationfinish.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  // {
  //   path: 'visitor-students',
  //   loadChildren: () => import('./staff-module/staff-module.module').then(mod => mod.StaffModuleModule)
  // },
  { path: "login", component: LoginComponent},
  { path: "register", component: RegisterComponent},
  { path: "placement", component: PlacementrecordComponent, canActivate: [StudentGuard]},
  { path: "videos", component: VideosComponent, canActivate: [StudentGuard]},
  { path: "infrastructure", component: InfrestComponent, canActivate: [StudentGuard]},
  { path: "art-work", component: WorkComponent, canActivate: [StudentGuard]},
  { path: "course-details/:id", component: CoursedetailsComponent, canActivate: [StudentGuard]},
  { path: "course", component: CourseComponent, canActivate: [StudentGuard]},
  { path: "application-personal",  component: ApplicationformComponent},
  { path: "application-education",  component: ApplicationeducationComponent},
  { path: "application-activity",  component: ApplicationactivitiesComponent},
  { path: "application-official",  component: ApplicationofficeComponent, canActivate: [AdminGuard]},
  { path: "application-finish",  component: ApplicationfinishComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
