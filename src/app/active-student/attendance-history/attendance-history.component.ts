import { Component, OnInit } from '@angular/core';
import { UserService, ActiveStudentService } from 'src/app/services';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-attendance-history',
  templateUrl: './attendance-history.component.html',
  styleUrls: ['./attendance-history.component.scss'],
})
export class AttendanceHistoryComponent implements OnInit {

  student_id: string;
  showloader: boolean;
  message: string;
  refresh_list: boolean;
  attendance_list: any = [];

  constructor(
    public loadingController: LoadingController,
    public alertCtrl: AlertController,
    public activeStudentService: ActiveStudentService,
    public userService: UserService
  ) { }

  ngOnInit() {}

  ionViewWillEnter() { 
    console.log('Location: AttendanceHistoryComponent');

    let user_info = this.userService.currentUserValue;
    this.student_id = user_info.details.id;
    
    this.showloader = true;
    this.refresh_list = false;
    this.attendance_list = [];

    this.loadAttendanceHistory();
  }

  async loadAttendanceHistory() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Loading students...',
      spinner: 'bubbles'
    });
    loading.present();
    this.showloader = true;
    this.message = null;

    let sendData = {
      student_id : this.student_id
    };

    this.activeStudentService.all_attendance(sendData).subscribe(async response => {
      console.log('Attendance list response: ', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();
      this.showloader = false;

      if(response.status == true && response.data) {
        this.refresh_list = true;
        this.attendance_list = response.data;
        this.message = null;
      } else {
        this.message = response.message;
        this.refresh_list = false;
        this.attendance_list = [];
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.message = "Unable load attendance list!"
      this.loadingController.dismiss();
      this.showloader = false;
      this.refresh_list = false;
      this.attendance_list = [];

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Internal problem! " + error,
        buttons: ['OK']
      });
      alert.present();
    });
  }

}
