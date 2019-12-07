import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LandingComponent } from './landing/landing.component';
import { TwoDComponent } from './two-d/two-d.component';
import { ThreeDComponent } from './three-d/three-d.component';
import { VfxComponent } from './vfx/vfx.component';
import { PlacementrecordComponent } from './placementrecord/placementrecord.component';
import { VideosComponent } from './videos/videos.component';
import { InfrestComponent } from './infrest/infrest.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  
  { path: "login",  component: LoginComponent},
  { path: "register",  component: RegisterComponent},
  { path: "landing",  component: LandingComponent},
  { path: "twod",  component: TwoDComponent},
  { path: "threed",  component: ThreeDComponent},
  { path: "vfx",  component: VfxComponent},
  { path: "placementrecord",  component:PlacementrecordComponent},
  { path: "videos",  component: VideosComponent},
  { path: "infrest",  component: InfrestComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
