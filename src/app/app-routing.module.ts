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
import { RegisterStudentComponent } from './register-student/register-student.component';
import { StudentGuard } from './guards/student.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: "login",  component: LoginComponent},
  { path: "register",  component: RegisterComponent},
  { path: "placement",  component: PlacementrecordComponent},
  { path: "videos",  component: VideosComponent},
  { path: "infrastructure",  component: InfrestComponent},
  { path: "art-work",  component: WorkComponent},
  { path: "course-details/:id",  component: CoursedetailsComponent},
  { path: "course",  component: CourseComponent},
  { path: "appilicationform",  component: ApplicationformComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
