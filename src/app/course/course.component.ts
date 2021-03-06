import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, VisitorsService } from '../services';
import { Platform, AlertController, LoadingController } from '@ionic/angular';
import { SITE_URL } from '../services/constants';
import { PdfViewerService } from '../services/pdf-viewer.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
  
  subscription:any;
  message: string = "Loading...";
  course_list: any = [];
  site_url: string;
  user_type: string;

  constructor(
    private router: Router,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public userService: UserService,
    public visitorsService: VisitorsService,
    private platform: Platform,
    private pdf: PdfViewerService
  ) {
    this.site_url = SITE_URL;
  }

  ngOnInit() {}

  ionViewWillEnter(){ 
    console.log('Location: CourseComponent');

    this.course_details();
  }

  ionViewDidEnter(){ 
    this.subscription = this.platform.backButton.subscribe(()=>{ 
      navigator['app'].exitApp(); 
    }); 
  } 

  ionViewWillLeave(){ 
    this.subscription.unsubscribe();
  }

  async course_details() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.visitorsService.course_list().subscribe(async response => {
      //console.log('Course details...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.course_list = response.data;
      } else {
        this.message = "No Course Available!"
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.message = "Unable load data!"
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Internal problem! " + error,
        buttons: ['OK']
      });
      alert.present();
    });
  }

  viewSyllabus(url, title) {
    this.pdf.download(url, title + ' Syllabus');
  }

}
