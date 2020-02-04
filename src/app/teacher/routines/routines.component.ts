import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, LoadingController } from '@ionic/angular';
import { TeacherService, UserService } from 'src/app/services';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.component.html',
  styleUrls: ['./routines.component.scss'],
})
export class RoutinesComponent implements OnInit {

  teacher_id: string;
  subscription:any;
  date: {year: number, month: number};
  showloader: boolean;
  message: string = "Loading...";
  //routine_list: any = [];
  routine_description: any = [];

  constructor(
    private platform: Platform,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public teacherService: TeacherService,
    public userService: UserService
  ) {
    let user_info = this.userService.currentUserValue;
    this.teacher_id = user_info.details.id;

    // const current = new Date();
    // var thisMonth = current.getMonth() + 1; //--- current.getMonth() returns month index 0 to 11
    // var thisYear = current.getFullYear();
    // var thisDay = current.getDate();
    // var newdate = new Date(current.getFullYear(), current.getMonth(), current.getDate()+5);
    // console.log('date details: ', current, thisMonth, thisYear, thisDay, newdate);
  }

  ngOnInit() {}

  ionViewWillEnter() { 
    console.log('Location: RoutinesComponent');

    this.showloader = false;
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
    let record_count = 1; //--- Increasing record match counter

    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Loading routine...',
      spinner: 'bubbles'
    });
    loading.present();
    this.showloader = true;
    
    while(record_count <= 30) {
      var newdate = new Date(current.getFullYear(), current.getMonth(), current.getDate() + day_count); //--- Increasing day by 1

      //--- For every routine check which this-date have any class/es or not
      routine_data.forEach(element => {
        let record_found = false;
        //--- If this-date is matched or crossed batch-start-date
        if(newdate >= this.date_parse(element.batch_start_date)) {
          let day_index = newdate.getDay() + 1; //--- Get day-index i.e. 1:Sunday, 2:Monday, ... , 7:Saturday

          if(day_index == element.week_day) {
            console.log('newdate check (record_count, day_index, newdate): ', record_count, day_index, newdate);
          }

          record_found = true;
          record_count++;
        }

        // if(record_found) {
        //   record_count++;
        // }
      });

      day_count++;
    }

    this.loadingController.dismiss();
    this.showloader = false;
  } 

  //--- Parse a date from string to Date type
  date_parse(date) {
    //--- Var date in type yyyy-mm-dd
    var parts = date.split("-"); //--- [0]:yyyy, [1]:mm, [2]:dd
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

}
