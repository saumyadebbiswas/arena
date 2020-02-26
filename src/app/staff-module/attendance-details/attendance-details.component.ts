import { Component, OnInit } from '@angular/core';
import { UserService, StaffWorkService } from 'src/app/services';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-attendance-details',
  templateUrl: './attendance-details.component.html',
  styleUrls: ['./attendance-details.component.scss'],
})
export class AttendanceDetailsComponent implements OnInit {

  showloader: boolean;
  admin_id: string;
  batch_id: string;
  batch_list: any;

  constructor(
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public staffWorkService: StaffWorkService,
    public userService: UserService
  ) {
    let user_info = this.userService.currentUserValue;
    this.admin_id = user_info.details.id;
  }

  ngOnInit() { }

  ionViewWillEnter() {
    console.log('Location: AttendanceDetailsComponent');

    this.showloader = true;
    this.batch_id = null;
    this.batch_list = [];

    this.active_batch_all();
  }

  async active_batch_all() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();
    this.showloader = true;

    this.staffWorkService.active_batch_list().subscribe(async response => {
      console.log('Active batch list...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();
      this.showloader = false;

      if (response.status == true) {
        this.batch_list = response.data;
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Error!',
          message: response.message,
          buttons: ['OK']
        });
        alert.present();
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to load batch list!",
        buttons: ['OK']
      });
      alert.present();
    });
  }

}
