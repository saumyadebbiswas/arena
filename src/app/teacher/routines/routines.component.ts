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
      message: 'Please wait...',
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

  routine_by_day(routine_data) {
    console.log('Routine data: ', routine_data);
    const current = new Date();
    let max_day = 60;
    for(let count = 1; count <= max_day; count++) {
      var newdate = new Date(current.getFullYear(), current.getMonth(), current.getDate() + count);


      //console.log('newdate: ', newdate);
      
      // var thisMonth = newdate.getMonth() + 1; //--- current.getMonth() returns month index 0 to 11
      // var thisYear = newdate.getFullYear();
      // var thisDay = newdate.getDate();
    }
  } 

  date_format(date) {
    var parts = date.split("-");
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }

}
