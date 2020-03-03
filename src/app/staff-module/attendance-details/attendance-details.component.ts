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
  batch_list: any = [];
  batch_id: string;
  batch_student_list: any = [];
  student_id: string;
  attendance_list: any = [];
  message: string;
  course_name: string;
  start_date: string;

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
    this.batch_student_list = [];
    this.student_id = null;
    this.attendance_list = [];
    this.course_name = null;
    this.start_date = null;

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

    let sendData = {
      'admin_id' : this.admin_id
    };

    this.staffWorkService.started_batch_list(sendData).subscribe(async response => {
      //console.log('Active batch list...', response);
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

  async batch_student() {
    //--- Start loader
    this.showloader = true;
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.change_effect('batch');

    this.staffWorkService.batch_details(this.batch_id).subscribe(async response => {
      //console.log('Batch details response: ', response);
      //--- After get record - dismiss loader
      this.showloader = false;
      this.loadingController.dismiss();

      if (response.status == true && response.data) {
        this.course_name = response.data.course_name;
        this.start_date = response.data.start_date;

        this.batch_student_list = response.data.students;
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
      this.showloader = false;

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to load batch students!",
        buttons: ['OK']
      });
      alert.present();
    });
  }

  async student_attendance_history() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Loading attendace list...',
      spinner: 'bubbles'
    });
    loading.present();
    //this.showloader = true;

    this.change_effect('student');

    let sendData = {
      batch_id : this.batch_id,
      student_id: this.student_id
    };

    this.staffWorkService.student_attendance(sendData).subscribe(async response => {
      //console.log('Attendance list response: ', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();
      //this.showloader = false;

      if (response.status == true && response.data) {
        this.attendance_list = response.data;
      } else {
        this.message = response.message;
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.message = "Unable to load attendance list!"
      this.loadingController.dismiss();
      //this.showloader = false;

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Internal problem! " + error,
        buttons: ['OK']
      });
      alert.present();
    });
  }

  //--- Funtion to refresh related variables after change any credential
  change_effect(change_type) {
    if (change_type == 'batch') {
      this.batch_student_list = [];
      this.student_id = null;
      this.course_name = null;
      this.start_date = null;
      this.attendance_list = [];
      this.message = null;
    } 
    if (change_type == 'student') {
      this.attendance_list = [];
      this.message = null;
    }
  }

  //--- Function to convert 24-hour time format(i.e. 14:30) to 12-hour time format(i.e. 02:30 PM)
  time_24to12_convert(time) {
    let hour = (time.split(':'))[0];
    let min = (time.split(':'))[1];
    let part = hour >= 12 ? 'PM' : 'AM';

    min = (min + '').length == 1 ? '0' + min : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour + '').length == 1 ? '0' + hour : hour;

    return hour + ':' + min + ' ' + part;
  }

  //--- Function to return day name by day index
  dayName(day_index) {
    //--- 1: Sunday, ..., 7: Saturday
    if (day_index == '1') {
      return 'Sunday';
    } else if (day_index == '2') {
      return 'Monday';
    } else if (day_index == '3') {
      return 'Tuesday';
    } else if (day_index == '4') {
      return 'Wednesday';
    } else if (day_index == '5') {
      return 'Thursday';
    } else if (day_index == '6') {
      return 'Friday';
    } else if (day_index == '7') {
      return 'Saturday';
    } else {
      return null;
    }
  }

}
