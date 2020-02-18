import { Component, OnInit } from '@angular/core';
import { UserService, TeacherService } from 'src/app/services';
import { NgbCalendar, NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {

  teacher_id: string;
  //view_calender: boolean;
  refresh_list: boolean;
  model: NgbDateStruct;
  showloader: boolean;
  message: string;
  student_list: any = [];
  class_details: any;

  constructor(
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig,
    public loadingController: LoadingController,
    public alertCtrl: AlertController,
    public toastController: ToastController,
    public teacherService: TeacherService,
    public userService: UserService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() { 
    console.log('Location: AttendanceComponent');

    let user_info = this.userService.currentUserValue;
    this.teacher_id = user_info.details.id;

    // const current = new Date();
    // const current_minus_30 = new Date(new Date().setDate(new Date().getDate() - 30)); // Remove 30 days from current date

    // //--- current.getMonth() returns month index 0 to 11
    // this.config.minDate = { year: current_minus_30.getFullYear(), month: 
    //   current_minus_30.getMonth() + 1, day: current_minus_30.getDate() }; // Min date: Remove 30 days from current date
    // this.config.maxDate = { year: current.getFullYear(), month: 
    // current.getMonth() + 1, day: current.getDate() }; //--- Max date: Today
    // this.config.outsideDays = 'hidden'; //--- Diasble all other dates
    
    // this.model = this.calendar.getToday(); //--- By default set today highlighted
    
    // this.view_calender = false;
    this.showloader = true;
    this.message = null;
    this.student_list = [];
    this.refresh_list = false;

    this.loadStudents();
  }

  // show_calender(show_type) {
  //   if(show_type == 'y') {
  //     this.view_calender = true;
  //     this.model = this.calendar.getToday();
  //   } else {
  //     this.view_calender = false;
  //   }
  // }

  // selectDate(model) {
  //   let selectedDate = this.createDateFromDateObject(model); 
  //   console.log('selectedDate: ', selectedDate);
    
  // }
  
  // createDateFromDateObject(obj) {
  //   let date = '';
  //   let month = '';

  //   if(obj.day.toString().length == 1) {
  //     date = `0${obj.day}`;
  //   } else {
  //     date = `${obj.day}`;
  //   }

  //   if(obj.month.toString().length == 1)  {
  //     month = `0${obj.month}`;
  //   } else {
  //     month = `${obj.month}`;
  //   }

  //   return `${obj.year}-${month}-${date}`;
  // }

  async loadStudents() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Loading students...',
      spinner: 'bubbles'
    });
    loading.present();
    this.showloader = true;

    let sendData = {
      teacher_id : this.teacher_id
    };
    this.teacherService.attendance_list(sendData).subscribe(async response => {
      //console.log('Attendance details: ', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();
      this.showloader = false;

      if(response.status == true && response.data[0]) {
        this.class_details = response.data[0];

        if(response.data[0].student_list) {
          this.student_list = response.data[0].student_list;
          this.refresh_list = true;
        } else {
          this.student_list = [];
          this.refresh_list = false;
        }
      } else {
        this.message = response.message;
        this.student_list = [];
        this.refresh_list = false;
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.message = "Unable load attendance list!"
      this.loadingController.dismiss();
      this.showloader = false;
      this.student_list = [];
      this.refresh_list = false;

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Internal problem! " + error,
        buttons: ['OK']
      });
      alert.present();
    });
  }
  
  //--- Function to convert 24-hour time format(i.e. 14:30) to 12-hourtime format(i.e. 02:30 PM)
  time_24to12_convert(time) {
    let hour = (time.split(':'))[0];
    let min = (time.split(':'))[1];
    let part = hour >= 12 ? 'PM' : 'AM';

    min = (min + '').length == 1 ? '0'+min : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour + '').length == 1 ? '0'+hour : hour;

    return hour+':'+min+' '+part;
  }

  async changeChkbx(index) {
    console.log('Check box index: ', index);
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();
    this.showloader = true;

    let attend_status: string;
    if(this.student_list[index].is_attend == 'n') {
      attend_status = 'y';
    } else {
      attend_status = 'n';
    }

    let sendData = {
      attandance_id : this.student_list[index].id,
      is_attend : attend_status
    };
    //console.log('Get attendance sendData: ', sendData);
    this.teacherService.get_attendance(sendData).subscribe(async response => {
      //console.log('Get attendance response: ', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();
      this.showloader = false;

      if(response.status == true) {
        const toast = await this.toastController.create({
          message: response.message,
          color: "dark",
          position: "bottom",
          duration: 2000
        });
        toast.present();

        this.student_list[index].is_attend = attend_status;
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
        message: "Internal problem! " + error,
        buttons: ['OK']
      });
      alert.present();
    });
  }

}
