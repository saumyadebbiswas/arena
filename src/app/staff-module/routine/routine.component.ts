import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { StaffWorkService, UserService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.component.html',
  styleUrls: ['./routine.component.scss'],
})
export class RoutineComponent implements OnInit {

  showloader: boolean = true;
  show_add_button: boolean = false;
  page_type: string = "insert";
  batch_list: any = [];
  teacher_list: any = [];
  admin_id: string;
  batch_id: string = null;
  //no_of_days: any = "1";
  //current_days: number = 1;
  week_days: any = [
    { "value": "1", "day": "Sunday" },
    { "value": "2", "day": "Monday" },
    { "value": "3", "day": "Tuesday" },
    { "value": "4", "day": "Wednesday" },
    { "value": "5", "day": "Thursday" },
    { "value": "6", "day": "Friday" },
    { "value": "7", "day": "Saturday" },
  ];
  day_details: any = [
    {
      "id": null,
      "week_day" : null,
      "start_time" : null,
      "duration" : null,
      "teacher_id" : null,
      "type": 1,
      "week_for": null
    }
  ];

  constructor(
    private route: ActivatedRoute,
    public alertCtrl: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public staffWorkService: StaffWorkService,
    public userService: UserService
  ) {
    let user_info = this.userService.currentUserValue;
    this.admin_id = user_info.details.id;
  }

  ngOnInit() {}

  ionViewWillEnter() { 
    console.log('Location: RoutineComponent');

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

    this.staffWorkService.active_batch_list().subscribe(async response => {
      //console.log('Active batch list...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();
      this.showloader = false;

      if(response.status == true) {
        this.batch_list = response.data;
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Error!',
          message: response.message,
          buttons: ['OK']
        });
        alert.present();
      }

      this.getBatchId();
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to load batch list!",
        buttons: ['OK']
      });
      alert.present();

      this.getBatchId();
    });
  }

  getBatchId() {
    if(this.route.snapshot.paramMap.get('id') != null) {
      this.batch_id = this.route.snapshot.paramMap.get('id');
      this.page_type = 'edit';
    }
    
    this.teacher_all();
  }

  async teacher_all() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();
    this.showloader = true;

    this.staffWorkService.teacher_list().subscribe(async response => {
      //console.log('Teacher list: ', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();
      this.showloader = false;

      if(response.status == true) {
        this.teacher_list = response.data;
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
        message: "Unable to load teacher list!",
        buttons: ['OK']
      });
      alert.present();
    });
  }

  add_routine() {
    this.day_details.push({
      "id": null,
      "week_day" : null,
      "start_time" : null,
      "duration" : null,
      "teacher_id" : null,
      "type": 1,
      "week_for": null
    });

    this.show_add_button = false;
  }
  
  async remove_routine(day_index) {
    if(this.day_details.length > 1) {
      if(this.day_details[day_index].id == null) {
        this.day_details.splice(day_index, 1);
        this.show_add_button = true;
      } else {
        
      }
    } else {
      const toast = await this.toastController.create({
        message: "Minimum one routine need to remain",
        color: "dark",
        position: "bottom",
        duration: 2000
      });
      toast.present();
    }
  }

  checkDayTimeAvl(day_index) {
    let count = 0;
    this.day_details.forEach(element => {
      //--- Skip current filling up day and check other day details week day m
      if(count != day_index) {
        let start_time_select = this.day_details[day_index].start_time;
        let duration_select = this.day_details[day_index].duration;
        let end_time_select = null;
        if(start_time_select != null && duration_select != null) {
          end_time_select = start_time_select + duration_select;
        }

        if(element.week_day == this.day_details[day_index].week_day) {
          let start_time = element.start_time;
          let duration = element.duration;
          
          if(start_time != null && duration != null) {
            let end_time = start_time + duration;
            console.log('Value select at: ', start_time_select, duration_select, end_time_select);
            console.log('Day found at: ', count, start_time, duration, end_time);
          }
        }
      }

      count++;
    });
  }

  changeChkbx(day_index) {
    if(this.day_details[day_index].type == 1) {
      this.day_details[day_index].type = 2;
    } else {
      this.day_details[day_index].type = 1;
      this.day_details[day_index].week_for = null;
    }
  }

  async onSubmit(day_index) {
    //--- Check empty and invalid credentials
    if(this.admin_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to assign routine!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.batch_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select batch!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.day_details[day_index].week_day == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select day!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.day_details[day_index].start_time == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select start time!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.day_details[day_index].duration == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select duration!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.day_details[day_index].teacher_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select teacher!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.day_details[day_index].type == 2 && this.day_details[day_index].week_for == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select temporary week!",
        buttons: ['OK']
      });
      alert.present();
    } else {
      //--- Start loader
      const loading = await this.loadingController.create({
        message: 'Please wait...',
        spinner: 'bubbles'
      });
      loading.present();
      this.loadingController.dismiss();
      
      let sendData = {
        admin_id: this.admin_id,
        batch_id: this.batch_id,
        week_day: this.day_details[day_index].week_day,
        start_time: this.day_details[day_index].start_time,
        duration: this.day_details[day_index].duration,
        teacher_id: this.day_details[day_index].teacher_id,
        type: this.day_details[day_index].type,
        week_for: this.day_details[day_index].week_for
      }
      console.log('Routine assign sendData: ', sendData);

      this.day_details[day_index].id = 1;
      this.show_add_button = true;
      this.page_type = 'edit';

      // this.staffWorkService.batch_insert(sendData).subscribe(async response => {
      //   //console.log('Batch assign response: ', response);
      //   //--- After record updated - dismiss loader
      //   this.loadingController.dismiss();

      //   if(response.status == true) {
      //     const toast = await this.toastController.create({
      //       message: response.message,
      //       color: "dark",
      //       position: "bottom",
      //       duration: 2000
      //     });
      //     toast.present();
      //   } else {
      //     const alert = await this.alertCtrl.create({
      //       header: 'Error!',
      //       message: response.message,
      //       buttons: ['OK']
      //     });
      //     alert.present();
      //   }
      // }, async error => {
      //   console.log('Routine assign error: ', error);
      //   //--- In case of login error - dismiss loader, show error message
      //   this.loadingController.dismiss();
      //   const alert = await this.alertCtrl.create({
      //     header: 'Error!',
      //     message: "Internal problem!",
      //     buttons: ['OK']
      //   });
      //   alert.present();
      // });
    }
  }

}
