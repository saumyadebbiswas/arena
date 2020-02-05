import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, LoadingController } from '@ionic/angular';
import { TeacherService, UserService } from 'src/app/services';
import { NgbDateStruct, NgbCalendar, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.component.html',
  styleUrls: ['./routines.component.scss'],
})
export class RoutinesComponent implements OnInit {

  teacher_id: string;
  subscription:any;
  model: NgbDateStruct;
  date: {year: number, month: number};
  showloader: boolean;
  message: string = "Loading...";
  //routine_list: any = [];
  routine_description: any;
  view_calender: boolean;

  constructor(
    private platform: Platform,
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public teacherService: TeacherService,
    public userService: UserService
  ) {
    const current = new Date();
    //--- current.getMonth() returns month index 0 to 11
    this.config.minDate = { year: current.getFullYear(), month: 
    current.getMonth() + 1, day: current.getDate() }; //--- Min date: today
    var maxMonth = current.getMonth() + 2; //--- Max date: upcoming one month / add one month
    var maxYear = current.getFullYear();
    var maxDay = current.getDate();

    if(current.getMonth() == 12) { //--- If month is november
      maxYear = current.getFullYear() + 1; //--- Add 1 year
      maxMonth = 1;
    }

    if(current.getDate() == 31) {
      maxDay = 30;
    }

    if(current.getMonth() == 1 && current.getDate() > 28) {
      maxDay = 28;
    }

    this.config.maxDate = { year: maxYear, month: maxMonth, day: maxDay };
    this.config.outsideDays = 'hidden';
  }

  ngOnInit() {}

  ionViewWillEnter() { 
    console.log('Location: RoutinesComponent');

    let user_info = this.userService.currentUserValue;
    this.teacher_id = user_info.details.id;
    
    this.showloader = true;
    this.model = this.calendar.getToday();
    this.routine_description = [];
    this.view_calender = false;
    this.routine_details();
  }

  ionViewDidEnter(){ 
    this.subscription = this.platform.backButton.subscribe(()=>{ 
      navigator['app'].exitApp(); 
    }); 
  } 

  ionViewWillLeave(){ 
    this.subscription.unsubscribe();
  }

  async routine_details() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Loading routine...',
      spinner: 'bubbles'
    });
    loading.present();
    this.showloader = true;

    this.teacherService.routine_list(this.teacher_id).subscribe(async response => {
      //console.log('Routine details: ', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();
      this.showloader = false;

      if(response.status == true) {
        this.routine_by_day(response.data);
        //this.routine_list = response.data;
      } else {
        this.message = "No Routine Available!"
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.message = "Unable load routine data!"
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

  async routine_by_day(routine_data) {
    console.log('Routine data: ', routine_data);

    const current = new Date();
    let day_count = 1; //--- Increasing day counter
    let record_count = 0; //--- Increasing record match counter

    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Loading routine...',
      spinner: 'bubbles'
    });
    loading.present();
    this.showloader = true;
    
    let time_details: any;
    //--- Show routine details of next 30 days from today
    while(record_count < 30) {
      var newdate = new Date(current.getFullYear(), current.getMonth(), current.getDate() + day_count); //--- Increasing day by 1

      //--- For every routine check wheather this-date have any class/es or not
      let record_found = false;
      time_details = [];
      routine_data.forEach(element => {
        //--- If this-date is matched or crossed batch-start-date
        if(newdate >= this.date_parse(element.batch_start_date)) {
          let day_index = newdate.getDay() + 1; //--- Get day-index i.e. 1:Sunday, 2:Monday, ... , 7:Saturday

          //--- If this-date day-index matched with batch's week-day-index
          if(day_index == element.week_day) {
            time_details.push({
              "start_time": this.time_24to12_convert(element.start_time),
              "duration": element.duration,
              "end_time": this.time_24to12_convert(element.end_time),
              "batch_name": element.batch_name
            });
            // console.log('newdate check (record_count, day_index, newdate): ', record_count, day_index, newdate);
            record_found = true;
          }
        }
      });

      if(record_found) {
        this.routine_description.push({
          "week_day" : this.dayName(newdate.getDay() + 1),
          "date" : newdate,
          "time_details": time_details
        });
        record_count++;
      }

      day_count++;
    }
    console.log('this.routine_description ', this.routine_description);

    this.loadingController.dismiss();
    this.showloader = false;
  } 

  //--- Parse a date from string to Date type
  date_parse(date) {
    //--- Var date in type yyyy-mm-dd
    var parts = date.split("-"); //--- [0]:yyyy, [1]:mm, [2]:dd
    return new Date(parts[0], parts[1] - 1, parts[2]);
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

  show_calender(show_type) {
    if(show_type == 'y') {
      this.view_calender = true;
    } else {
      this.view_calender = false;
    }
  }

  selectDate(model) {
    let selectedDate = this.createDateFromDateObject(model); 
    console.log('Selected date: ', selectedDate);
  }
  
  createDateFromDateObject(obj) {
    let date = '';
    let month = '';

    if(obj.day.toString().length == 1){
      date = `0${obj.day}`;
    }else{
      date = `${obj.day}`;
    }

    if(obj.month.toString().length == 1){
      month = `0${obj.month}`;
    }else{
      month = `${obj.month}`;
    }

    return `${obj.year}-${month}-${date}`;
  }

}
