import { Component, OnInit } from '@angular/core';
import { SITE_URL } from '../services/constants';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserService, VisitorsService } from '../services';

@Component({
  selector: 'app-placementrecord',
  templateUrl: './placementrecord.component.html',
  styleUrls: ['./placementrecord.component.scss'],
})
export class PlacementrecordComponent implements OnInit {

  message: string = "Loading..."
  year_list: any = [];
  placement_list: any = [];
  site_url: string;

  constructor(
    private router: Router,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public userService: UserService,
    public visitorsService: VisitorsService
  ) {
    this.site_url = SITE_URL;
  }

  ngOnInit() {}

  ionViewWillEnter() { 
    if(this.userService.currentUserValue == null) {
      this.router.navigate(['/login']);
    } else {
      console.log('Location: PlacementrecordComponent');

      this.year_details();
    }
  }

  async year_details() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.visitorsService.placement_year_list().subscribe(async response => {
      //console.log('Placement year list...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.year_list = response.data;
        
        this.placement_details();
      } else {
        this.message = "No Placement Year Available!"
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

  async placement_details() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.visitorsService.placement_list().subscribe(async response => {
      console.log('Placement list...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.placement_list = response.data;
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

}
