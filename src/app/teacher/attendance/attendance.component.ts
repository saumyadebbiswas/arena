import { Component, OnInit } from '@angular/core';
import { UserService, TeacherService } from 'src/app/services';
//import { NgbCalendar, NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {

  teacher_id: string;
  //view_calender: boolean;
  //model: NgbDateStruct;
  showloader: boolean;
  message: string;
  message_allcls: string;
  message_clsdtl: string;
  student_list: any = [];
  class_list: any = [];
  details_student_list: any = [];
  class_details: any;
  show_class_link: string;
  refresh_list: boolean;
  show_current_class: boolean;
  show_all_class: boolean;
  show_all_details: boolean;

  constructor(
    //private calendar: NgbCalendar,
    //private config: NgbDatepickerConfig,
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
    this.student_list = [];
    this.class_list = [];
    this.details_student_list = [];
    this.show_class_link = 'all';
    this.refresh_list = false;
    this.show_current_class = true;
    this.show_all_class = false;
    this.show_all_details = false;

    this.loadCurrentStudents();
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

  async loadCurrentStudents() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Loading students...',
      spinner: 'bubbles'
    });
    loading.present();
    this.showloader = true;
    this.message = null;
    this.show_class_link = 'all';
    this.show_current_class = true;
    this.show_all_class = false;
    this.show_all_details = false;

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
      this.message = "Unable to load attendance list!"
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

  async loadAllClasses() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Loading students...',
      spinner: 'bubbles'
    });
    loading.present();
    this.message_allcls = null;
    this.show_class_link = 'current';
    this.show_current_class = false;
    this.show_all_class = true;
    this.show_all_details = false;

    let sendData = {
      teacher_id : this.teacher_id
    };
    this.teacherService.all_class_list(sendData).subscribe(async response => {
      //console.log('All class response: ', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();
      this.showloader = false;

      if(response.status == true) {
        this.class_list = response.data;
      } else {
        this.message_allcls = response.message;
        this.class_list = [];
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.message_allcls = "Unable load all classes!";
      this.class_list = [];

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Internal problem! " + error,
        buttons: ['OK']
      });
      alert.present();
    });
  }

  async loadAllClassesDetails(index) {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Loading students...',
      spinner: 'bubbles'
    });
    loading.present();
    this.message_clsdtl = null;
    this.show_current_class = false;
    this.show_all_class = false;
    this.show_all_details = true;

    let sendData = {
      batch_id: this.class_list[index].batch_id,
      date: this.class_list[index].date,
      time: this.class_list[index].time,
      week_day: this.class_list[index].week_day
    };
    //console.log('All class details sendData: ', sendData);
    this.teacherService.class_details(sendData).subscribe(async response => {
      //console.log('All class details response: ', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();
      this.showloader = false;

      if(response.status == true) {
        this.details_student_list = response.data;
      } else {
        this.message_clsdtl = response.message;
        this.details_student_list = [];
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.message_clsdtl = "Unable load all classes!";
      this.details_student_list = [];

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

  //--- Function to return day name by day index
  dayName(day_index) {
    //--- 1: Sunday, ..., 7: Saturday
    if(day_index == '1') {
      return 'Sunday';
    } else if(day_index == '2') {
      return 'Monday';
    } else if(day_index == '3') {
      return 'Tuesday';
    } else if(day_index == '4') {
      return 'Wednesday';
    } else if(day_index == '5') {
      return 'Thursday';
    } else if(day_index == '6') {
      return 'Friday';
    } else if(day_index == '7') {
      return 'Saturday';
    } else {
      return null;
    }
  }

  async changeChkbx(index) {
    //console.log('Check box index: ', index);
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

  async changeChkbxForOld(index) {
    //console.log('Check box index: ', index);
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();
    this.showloader = true;

    let attend_status: string;
    if(this.details_student_list[index].is_attend == 'n') {
      attend_status = 'y';
    } else {
      attend_status = 'n';
    }

    let sendData = {
      attandance_id : this.details_student_list[index].id,
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

        this.details_student_list[index].is_attend = attend_status;
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
