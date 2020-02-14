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
  routine_description: any = [];
  routine_description_fix: any;
  view_calender: boolean;

  constructor(
    private platform: Platform,
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public teacherService: TeacherService,
    public userService: UserService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() { 
    console.log('Location: RoutinesComponent');

    let user_info = this.userService.currentUserValue;
    this.teacher_id = user_info.details.id;

    const current = new Date();
    const current_plus_30 = new Date(new Date().setDate(new Date().getDate() + 30)); // Add 30 days with current date

    //--- current.getMonth() returns month index 0 to 11
    this.config.minDate = { year: current.getFullYear(), month: 
    current.getMonth() + 1, day: current.getDate() }; //--- Min date: Today
    this.config.maxDate = { year: current_plus_30.getFullYear(), month: 
      current_plus_30.getMonth() + 1, day: current_plus_30.getDate() }; // Max date: Add 30 days with current date
    this.config.outsideDays = 'hidden'; //--- Diasble all other dates
    
    this.model = this.calendar.getToday(); //--- By default set today highlighted

    this.showloader = true;
    this.routine_description = [];
    this.routine_description_fix = [];
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
    //console.log('Routine data: ', routine_data);
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
    while(day_count <= 30) {
      var newdate = new Date(current.getFullYear(), current.getMonth(), current.getDate() + day_count); //--- Increasing day by 1

      //--- For every routine check wheather this-date have any class/es or not
      let record_found = false;
      time_details = [];
      routine_data.forEach(element => {
        //--- If this-date is matched or crossed batch-start-date
        if(newdate >= this.date_parse(element.batch_start_date)) {
          let day_index = newdate.getDay() + 1; //--- Get day-index i.e. 1:Sunday, 2:Monday, ... , 7:Saturday

          if(+element.type == 1 && +element.is_enable == 1) { //--- If this routine is not temporary one and also enable currently
            if(day_index == element.week_day) { //--- If this-date day-index matched with batch's week-day-index
              time_details.push({
                "start_time": this.time_24to12_convert(element.start_time),
                "duration": element.duration,
                "end_time": this.time_24to12_convert(element.end_time),
                "batch_name": element.batch_name,
                "course_name": element.course_name
              });
              record_found = true;
            }
          } else if(+element.type == 1 && +element.is_enable == 0) { //--- If this routine is not temporary one and currently disabled
            let temp_start_date = this.date_parse(element.temp_start_date);
            let temp_day = +element.temp_week * 7; //--- Calculate temporary day from temporary week
            var temp_finish_date = new Date(temp_start_date.getFullYear(), temp_start_date.getMonth(), temp_start_date.getDate() + (temp_day-1)); //--- Calculate date from which this routine will enable again

            if(newdate < temp_start_date || newdate > temp_finish_date) {
              if(day_index == element.week_day) { //--- If this-date day-index matched with batch's week-day-index
                time_details.push({
                  "start_time": this.time_24to12_convert(element.start_time),
                  "duration": element.duration,
                  "end_time": this.time_24to12_convert(element.end_time),
                  "batch_name": element.batch_name,
                  "course_name": element.course_name
                });
                record_found = true;
              }
            }
            
          } else if(+element.type == 2 && +element.is_enable == 1) { //--- If this routine is a temporary one and currently enable
            let temp_start_date = this.date_parse(element.temp_start_date);
            let temp_day = +element.temp_week * 7; //--- Calculate temporary day from temporary week
            var temp_finish_date = new Date(temp_start_date.getFullYear(), temp_start_date.getMonth(), temp_start_date.getDate() + (temp_day-1));

            if(newdate >= temp_start_date && newdate <= temp_finish_date) {
              if(day_index == element.week_day) { //--- If this-date day-index matched with batch's week-day-index
                time_details.push({
                  "start_time": this.time_24to12_convert(element.start_time),
                  "duration": element.duration,
                  "end_time": this.time_24to12_convert(element.end_time),
                  "batch_name": element.batch_name,
                  "course_name": element.course_name
                });
                record_found = true;
              }
            }
          }
        }
      });

      if(record_found) {
        this.routine_description.push({
          "week_day" : this.dayName(newdate.getDay() + 1),
          "date" : newdate,
          "date_dd" : newdate.getDate(),
          "date_mm" : newdate.getMonth(),
          "date_yyyy" : newdate.getFullYear(),
          "time_details": time_details
        });
        record_count++;
      }

      day_count++;
    }
    this.routine_description_fix = this.routine_description;
    //console.log('this.routine_description ', this.routine_description);

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
      this.model = this.calendar.getToday();
    } else {
      this.view_calender = false;
      this.routine_description = this.routine_description_fix;
    }
  }

  selectDate(model) {
    this.routine_description = this.routine_description_fix;
    let selectedDate = this.createDateFromDateObject(model); 
    var parts = selectedDate.split("-"); //--- [0]:yyyy, [1]:mm, [2]:dd

    let routine_description: any = [];
    this.routine_description.forEach(element => {
      //--- Check if any routine available in routine-description of the selected-date
      if(+element.date_dd == +parts[2] && +element.date_mm == (+parts[1] - 1) && +element.date_yyyy == +parts[0]) {
        routine_description.push(element);
      }
    });

    this.routine_description = routine_description;
  }
  
  createDateFromDateObject(obj) {
    let date = '';
    let month = '';

    if(obj.day.toString().length == 1) {
      date = `0${obj.day}`;
    } else {
      date = `${obj.day}`;
    }

    if(obj.month.toString().length == 1)  {
      month = `0${obj.month}`;
    } else {
      month = `${obj.month}`;
    }

    return `${obj.year}-${month}-${date}`;
  }

}
