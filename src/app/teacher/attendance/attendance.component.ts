import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services';
import { NgbCalendar, NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {

  teacher_id: string;
  view_calender: boolean;
  model: NgbDateStruct;

  constructor(
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig,
    public userService: UserService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() { 
    console.log('Location: AttendanceComponent');

    let user_info = this.userService.currentUserValue;
    this.teacher_id = user_info.details.id;

    const current = new Date();
    const current_minus_30 = new Date(new Date().setDate(new Date().getDate() - 30)); // Remove 30 days from current date

    //--- current.getMonth() returns month index 0 to 11
    this.config.minDate = { year: current_minus_30.getFullYear(), month: 
      current_minus_30.getMonth() + 1, day: current_minus_30.getDate() }; // Min date: Remove 30 days from current date
    this.config.maxDate = { year: current.getFullYear(), month: 
    current.getMonth() + 1, day: current.getDate() }; //--- Max date: Today
    this.config.outsideDays = 'hidden'; //--- Diasble all other dates
    
    this.model = this.calendar.getToday(); //--- By default set today highlighted
    
    //this.showloader = true;
    this.view_calender = false;
  }

  show_calender(show_type) {
    if(show_type == 'y') {
      this.view_calender = true;
      this.model = this.calendar.getToday();
    } else {
      this.view_calender = false;
    }
  }

  selectDate(model) {
    let selectedDate = this.createDateFromDateObject(model); 
    console.log('selectedDate: ', selectedDate);
    
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
