import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { StaffWorkService, UserService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.component.html',
  styleUrls: ['./routine.component.scss'],
})
export class RoutineComponent implements OnInit {

  batch_list: any = [];
  teacher_list: any = [];
  admin_id: string;
  batch_id: string = null;
  no_of_days: any = "1";
  current_days: number = 1;
  week_days: any = [
    { "value": "1", "day": "Sunday" },
    { "value": "2", "day": "Monday" },
    { "value": "3", "day": "Tuesday" },
    { "value": "4", "day": "Wednesday" },
    { "value": "5", "day": "Thursday" },
    { "value": "6", "day": "Friday" },
    { "value": "7", "day": "Saturday" },
  ];
  day_details: any = [
    {
      "week_day" : "",
      "start_time" : "",
      "duration" : "",
      "teacher_id" : ""
    }
  ];

  constructor(
    private route: ActivatedRoute,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public staffWorkService: StaffWorkService,
    public userService: UserService
  ) {
    let user_info = this.userService.currentUserValue;
    this.admin_id = user_info.details.id;
  }

  ngOnInit() {}

  ionViewWillEnter() { 
    console.log('Location: RoutineComponent');

    this.active_batch_all();
  }

  async active_batch_all() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.staffWorkService.active_batch_list().subscribe(async response => {
      //console.log('Active batch list...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.batch_list = response.data;
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Error!',
          message: response.message,
          buttons: ['OK']
        });
        alert.present();
      }

      this.getBatchId();
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to load batch list!",
        buttons: ['OK']
      });
      alert.present();

      this.getBatchId();
    });
  }

  getBatchId() {
    if(this.route.snapshot.paramMap.get('id') != null) {
      this.batch_id = this.route.snapshot.paramMap.get('id');
    }
    
    //this.teacher_all();
  }

  async teacher_all() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.staffWorkService.teacher_list().subscribe(async response => {
      console.log('Teacher list: ', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.teacher_list = response.data;
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Error!',
          message: response.message,
          buttons: ['OK']
        });
        alert.present();
      }

      this.getBatchId();
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to load teacher list!",
        buttons: ['OK']
      });
      alert.present();

      this.getBatchId();
    });
  }

  changeDays(event) {
    let days_select = event.target.value;
    
    if(days_select > this.current_days) {
      for(let i = this.current_days; i < days_select; i++) {
        this.day_details[i] = {
          "week_day" : "",
          "start_time" : "",
          "duration" : "",
          "teacher_id" : ""
        }
      }
    } else if(days_select < this.current_days) {
      // Error logic
      // for(let i = this.current_days; i > days_select; i--) {
      //   console.log('counter: ', i);
      //   this.day_details.splice(i, 1);
      // }
    }

    this.current_days = days_select;
    console.log('this.day_details: ', this.day_details);
  }

}
