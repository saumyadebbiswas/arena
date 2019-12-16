import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, VisitorsService } from '../services';
import { Platform, AlertController, LoadingController } from '@ionic/angular';
import { SITE_URL } from '../services/constants';
//import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { PdfViewerService } from '../services/pdf-viewer.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
  
  subscription:any;
  message: string = "Loading..."
  course_list: any = [];
  site_url: string;

  constructor(
    private router: Router,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public userService: UserService,
    public visitorsService: VisitorsService,
    private platform: Platform,
    //private fileOpener: FileOpener,
    private documentViewer: DocumentViewer,
    private pdf: PdfViewerService
  ) {
    this.site_url = SITE_URL;
  }

  ngOnInit() {}

  ionViewWillEnter(){ 
    if(this.userService.currentUserValue == null) {
      this.router.navigate(['/login']);
    } else {
      console.log('Location: CourseComponent');

      this.course_details();
    }
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
    console.log('Syllabus url and title...', url, title);
    this.pdf.download(url, title);

    // const options: DocumentViewerOptions = {
    //   title: 'Syllabus'
    // }

    // this.documentViewer.viewDocument(file_path, 'application/pdf', options);
    // this.fileOpener.open(file_path, 'application/pdf')
    // .then(() => console.log('File is opened'))
    // .catch(e => console.log('Error opening file', e));
  }

}
