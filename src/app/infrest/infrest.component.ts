import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserService, VisitorsService } from '../services';
import { SITE_URL } from '../services/constants';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Component({
  selector: 'app-infrest',
  templateUrl: './infrest.component.html',
  styleUrls: ['./infrest.component.scss'],
})
export class InfrestComponent implements OnInit {

  message: string = "Loading..."
  campus_list: any = [];
  infras_images: any = [];
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

  ionViewWillEnter() { 
    if(this.userService.currentUserValue == null) {
      this.router.navigate(['/login']);
    } else {
      console.log('Location: InfrestComponent');

      this.campus_all();
    }
  }

  async campus_all() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.visitorsService.campus_list().subscribe(async response => {
      //console.log('Campus list details...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.campus_list = response.data;

        this.infrastructure_all();
      } else {
        this.message = "No Campus Available!"
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.message = "Unable to load campus list!"
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Internal problem! Unable to load campus list.",
        buttons: ['OK']
      });
      alert.present();
    });
  }

  async infrastructure_all() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    let campus_id = this.campus_list[0].id;

    this.visitorsService.infrastructure_list(campus_id).subscribe(async response => {
      console.log('Infrastructure list details...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.infras_images = response.data.images;
      } else {
        this.message = "No Infrastructure Available!"
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.message = "Unable to load infrastructure!"
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Internal problem! Unable to load infrastructure.",
        buttons: ['OK']
      });
      alert.present();
    });
  }

  viewImage(imagePath) {
    this.photoViewer.show(imagePath);
  }

}
