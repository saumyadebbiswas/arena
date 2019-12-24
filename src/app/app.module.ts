import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PlacementrecordComponent } from './placementrecord/placementrecord.component';
import { VideosComponent } from './videos/videos.component';
import { InfrestComponent } from './infrest/infrest.component';
import { WorkComponent } from './work/work.component';
import { CoursedetailsComponent } from './coursedetails/coursedetails.component';
import { CourseComponent } from './course/course.component';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { File } from "@ionic-native/file/ngx";
import { FileTransfer } from "@ionic-native/file-transfer/ngx";
import { PdfViewerService } from "./services/pdf-viewer.service";
import { ApplicationformComponent } from './applicationform/applicationform.component';
import { NotificationComponent } from './notification/notification.component';
import { RegisterStudentComponent } from './register-student/register-student.component';
import { ApplicationeducationComponent } from './applicationeducation/applicationeducation.component';
import { ApplicationactivitiesComponent } from './applicationactivities/applicationactivities.component';
import { ApplicationofficeComponent } from './applicationoffice/applicationoffice.component';
import { ApplicationfinishComponent } from './applicationfinish/applicationfinish.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PlacementrecordComponent,
    VideosComponent,
    InfrestComponent,
    WorkComponent,
    CoursedetailsComponent,
    CourseComponent,
    NotificationComponent,
    RegisterStudentComponent,
    ApplicationformComponent,
    ApplicationeducationComponent,
    ApplicationactivitiesComponent,
    ApplicationofficeComponent,
    ApplicationfinishComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    PhotoViewer,
    DocumentViewer,
    FileTransfer,
    FileOpener,
    File,
    PdfViewerService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
