import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserService, VisitorsService } from '../services';
import { SITE_URL } from '../services/constants';

@Component({
  selector: 'app-infrest',
  templateUrl: './infrest.component.html',
  styleUrls: ['./infrest.component.scss'],
})
export class InfrestComponent implements OnInit {

  message: string = "Loading..."
  campus_list: any = [];
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
      console.log('Location: InfrestComponent');

      //this.campus_details();
    }
  }

  // async campus_details() {
  //   //--- Start loader
  //   const loading = await this.loadingController.create({
  //     message: 'Please wait...',
  //     spinner: 'bubbles'
  //   });
  //   loading.present();

  //   this.visitorsService.campus_list().subscribe(async response => {
  //     console.log('Campus list details...', response);
  //     //--- After get record - dismiss loader
  //     this.loadingController.dismiss();

  //     if(response.status == true) {
  //       this.campus_list = response.data;
  //     } else {
  //       this.message = "No Campus Available!"
  //     }
  //   }, async error => {
  //     //--- In case of any error - dismiss loader, show error message
  //     this.message = "Unable load data!"
  //     this.loadingController.dismiss();

  //     const alert = await this.alertCtrl.create({
  //       header: 'Error!',
  //       message: "Internal problem! " + error,
  //       buttons: ['OK']
  //     });
  //     alert.present();
  //   });
  // }

}
