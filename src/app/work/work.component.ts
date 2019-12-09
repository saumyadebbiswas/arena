import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, VisitorsService } from '../services';
import { AlertController, LoadingController } from '@ionic/angular';
import { SITE_URL } from '../services/constants';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss'],
})
export class WorkComponent implements OnInit {

  message: string = "Loading..."
  category_list: any = [];
  art_list: any = [];
  site_url: string;

  constructor(
    private router: Router,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public userService: UserService,
    public visitorsService: VisitorsService,
    private photoViewer: PhotoViewer
  ) {
    this.site_url = SITE_URL;
  }

  ngOnInit() {}

  ionViewWillEnter(){ 
    if(this.userService.currentUserValue == null) {
      this.router.navigate(['/login']);
    } else {
      console.log('Location: WorkComponent');

      this.art_category_details();
    }
  }

  async art_category_details() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.visitorsService.art_categories().subscribe(async response => {
      //console.log('Art category details...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.category_list = response.data;
        
        this.art_details();
      } else {
        this.message = "No Art-Category Available!"
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.message = "Unable load data!"
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Internal problem! "+error,
        buttons: ['OK']
      });
      alert.present();
    });
  }

  async art_details() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.visitorsService.art_list().subscribe(async response => {
      console.log('Art details...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.art_list = response.data;
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Internal problem! "+error,
        buttons: ['OK']
      });
      alert.present();
    });
  }

  viewImage(imagePath) {
    this.photoViewer.show(imagePath);
  }

}
