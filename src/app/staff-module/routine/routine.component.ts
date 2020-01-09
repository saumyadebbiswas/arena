import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { StaffWorkService, UserService } from 'src/app/services';
import { ActivatedRoute, Router } from '@angular/router';

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
      "start_time_temp" : null,
      "start_time" : null,
      "duration_temp" : null,
      "duration" : null,
      "teacher_id" : null,
      "type": 1,
      "week_for": null
    }
  ];

  constructor(
    private router: Router,
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

  checkDayTimeAvl(day_index, field_type) {
    let error = false;
    let count = 0;
    let start_time_temp_select = this.format_time(this.day_details[day_index].start_time_temp);
    let duration_temp_select = this.format_time(this.day_details[day_index].duration_temp);
    let end_time_select = null;
    if(start_time_temp_select != null && duration_temp_select != null) {
      end_time_select = this.cal_end_time(start_time_temp_select, duration_temp_select);
    }

    this.day_details.forEach(async element => {
      //--- Skip current filling up day and check other day details week day m
      if(count != day_index) {
        if(element.week_day == this.day_details[day_index].week_day) {
          let start_time_temp = this.format_time(element.start_time_temp);
          let duration_temp = this.format_time(element.duration_temp);
          
          if(start_time_temp != null && duration_temp != null) {
            let end_time = this.cal_end_time(start_time_temp, duration_temp);

            if((start_time_temp_select <= end_time) && (end_time_select >= start_time_temp)) {
              error = true;
              // const alert = await this.alertCtrl.create({
              //   header: 'Oops!',
              //   message: 'Time conflict with Day ' + (count+1),
              //   buttons: ['OK']
              // });
              // alert.present();
              const toast = await this.toastController.create({
                message: 'Time conflict with Day ' + (count+1),
                color: "dark",
                position: "bottom",
                duration: 2000
              });
              toast.present();

              if(field_type == 'wd') {
                this.day_details[day_index].week_day = null;
              } else if(field_type == 'st') {
                this.day_details[day_index].start_time_temp = null;
              } else if(field_type == 'du') {
                this.day_details[day_index].duration_temp = null;
              }
            }
          }
        }
      }

      count++;
    });

    if(!error) {
      this.day_details[day_index].start_time = start_time_temp_select;
      this.day_details[day_index].duration = duration_temp_select;
    }
  }

  format_time(datetime) {
    if(datetime) {
      let datetime_split = datetime.split('T');
      let time1_arr = datetime_split[1].split('+');
      let timeonly_arr = time1_arr[0].split(':');

      return timeonly_arr[0]+':'+timeonly_arr[1];
    } else {
      return null;
    }
  }

  cal_end_time(start_time_temp, duration_temp) {
    let start_time_temp_arr = start_time_temp.split(':');
    let duration_temp_arr = duration_temp.split(':');

    let end_time_hour = +start_time_temp_arr[0] + +duration_temp_arr[0];
    let end_time_min = +start_time_temp_arr[1] + +duration_temp_arr[1];
    if(end_time_min >= 60) {
      end_time_min = end_time_min%60;
      end_time_hour++;
    }

    let end_time_hour_new = end_time_hour<10 ? '0'+end_time_hour : end_time_hour;
    let end_time_min_new = end_time_min<10 ? '0'+end_time_min : end_time_min;

    return end_time_hour_new+':'+end_time_min_new;
  }

  // async onSubmit() {
  //   //--- Check empty and invalid credentials
  //   if(this.admin_id == null) {
  //     const alert = await this.alertCtrl.create({
  //       header: 'Error!',
  //       message: "Unable to assign!",
  //       buttons: ['OK']
  //     });
  //     alert.present();
  //   } else if(this.batch_id == null) {
  //     const alert = await this.alertCtrl.create({
  //       header: 'Error!',
  //       message: "Select batch!",
  //       buttons: ['OK']
  //     });
  //     alert.present();
  //   } else {
  //     let day_details_msg = "";

  //     let count = 1;
  //     this.day_details.forEach(async element => {
  //       if(element.week_day == null) {
  //         day_details_msg += "Select day "+count+" week day! <br>";
  //       }
  //       if(element.start_time == null) {
  //         day_details_msg += "Select day "+count+" start time! <br>";
  //       }
  //       if(element.duration == null) {
  //         day_details_msg += "Select day "+count+" duration! <br>";
  //       }
  //       if(element.teacher_id == null) {
  //         day_details_msg += "Select day "+count+" teacher! <br>";
  //       }

  //       count++;
  //     });

  //     if(day_details_msg.length != 0) {
  //       const alert = await this.alertCtrl.create({
  //         header: 'Error!',
  //         message: day_details_msg,
  //         buttons: ['OK']
  //       });
  //       alert.present();
  //     } else {
  //       //--- Start loader
  //       const loading = await this.loadingController.create({
  //         message: 'Please wait...',
  //         spinner: 'bubbles'
  //       });
  //       loading.present();
        
  //       let sendData = {
  //         admin_id: this.admin_id,
  //         batch_id: this.batch_id,
  //         //no_of_days_in_week: this.no_of_days,
  //         day_details: this.day_details
  //       }
  //       //console.log('Routine assign sendData: ', sendData);

  //       this.staffWorkService.routine_assign(sendData).subscribe(async response => {
  //         //console.log('Routine assign response: ', response);
  //         //--- After record updated - dismiss loader
  //         this.loadingController.dismiss();

  //         if(response.status == true) {
  //           const toast = await this.toastController.create({
  //             message: response.message,
  //             color: "dark",
  //             position: "bottom",
  //             duration: 2000
  //           });
  //           toast.present();

  //           this.router.navigate(['/batch-list']);
  //         } else {
  //           const alert = await this.alertCtrl.create({
  //             header: 'Error!',
  //             message: response.message,
  //             buttons: ['OK']
  //           });
  //           alert.present();
  //         }
  //       }, async error => {
  //         console.log('Routine assign error: ', error);
  //         //--- In case of login error - dismiss loader, show error message
  //         this.loadingController.dismiss();
  //         const alert = await this.alertCtrl.create({
  //           header: 'Error!',
  //           message: "Internal problem!",
  //           buttons: ['OK']
  //         });
  //         alert.present();
  //       });
  //     }
  //   }
  // }

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

  async tooltipMsg(message) {
    const toast = await this.toastController.create({
      message: message,
      color: "dark",
      position: "bottom",
      duration: 2000
    });
    toast.present();
  }

}
