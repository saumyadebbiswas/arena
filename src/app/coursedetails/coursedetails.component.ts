import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserService, VisitorsService } from '../services';
import { SITE_URL } from '../services/constants';
import { PdfViewerService } from '../services/pdf-viewer.service';

@Component({
  selector: 'app-coursedetails',
  templateUrl: './coursedetails.component.html',
  styleUrls: ['./coursedetails.component.scss'],
})
export class CoursedetailsComponent implements OnInit {

  course_id: any;
  message: string = "Loading..."
  course_details: any = [];
  site_url: string;

  constructor(
    private route:ActivatedRoute,
    private router: Router,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public userService: UserService,
    public visitorsService: VisitorsService,
    private pdf: PdfViewerService
  ) {
    this.site_url = SITE_URL;
  }

  ngOnInit() {}

  ionViewWillEnter(){ 
    if(this.userService.currentUserValue == null) {
      this.router.navigate(['/login']);
    } else {
      console.log('Location: CoursedetailsComponent');

      this.course_id = this.route.snapshot.paramMap.get('id');
      //console.log('this.course_id', this.course_id);

      this.course_detail();
    }
  }

  async course_detail() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.visitorsService.course_details(this.course_id).subscribe(async response => {
      console.log('Course details...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.course_details = response.data;
      } else {
        this.message = "Details Not Available!"
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
