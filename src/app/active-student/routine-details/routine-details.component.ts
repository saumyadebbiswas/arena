import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-routine-details',
  templateUrl: './routine-details.component.html',
  styleUrls: ['./routine-details.component.scss'],
})
export class RoutineDetailsComponent implements OnInit {

  subscription:any;
  model: NgbDateStruct;
  date: {year: number, month: number};
  showloader: boolean;

  constructor(
    private platform: Platform,
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig
  ) {
    const current = new Date();
    //--- current.getMonth() returns month index 0 to 11
    this.config.minDate = { year: current.getFullYear(), month: 
    current.getMonth() + 1, day: current.getDate() }; //--- Min date: today
    var maxMonth = current.getMonth() + 3; //--- Max date: upcoming two months / add two month
    var maxYear = current.getFullYear();
    var maxDay = current.getDate();

    if(current.getMonth() == 10) { //--- If month is november
      maxYear = current.getFullYear() + 1; //--- Add 1 year
      maxMonth = 1; //--- Add 1 month
    } else if(current.getMonth() == 11) { //--- If month is december
      maxYear = current.getFullYear() + 1; //--- Add 1 year
      maxMonth = 2; //--- Add 2 month
    }

    if(current.getDate() == 31) {
      maxDay = 30;
    }

    if(current.getMonth() == 11 && current.getDate() > 28) {
      maxDay = 28;
    }

    this.config.maxDate = { year: maxYear, month: maxMonth, day: maxDay };
    this.config.outsideDays = 'hidden';
  }

  ngOnInit() {}

  ionViewWillEnter() { 
    console.log('Location: RoutineDetailsComponent');

    this.showloader = false;
    this.model = this.calendar.getToday();
  }

  ionViewDidEnter(){ 
    this.subscription = this.platform.backButton.subscribe(()=>{ 
      navigator['app'].exitApp(); 
    }); 
  } 

  ionViewWillLeave(){ 
    this.subscription.unsubscribe();
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
