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

  showloader: boolean;
  show_add_button: boolean;
  batch_list: any;
  teacher_list: any;
  admin_id: string;
  batch_id: string;
  student_list_details: any;
  teachers_time_conflict_details: any = [];
  students_time_conflict_details: any = [];
  week_days: any = [
    { "value": "1", "day": "Sunday" },
    { "value": "2", "day": "Monday" },
    { "value": "3", "day": "Tuesday" },
    { "value": "4", "day": "Wednesday" },
    { "value": "5", "day": "Thursday" },
    { "value": "6", "day": "Friday" },
    { "value": "7", "day": "Saturday" },
  ];
  day_details: any;

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

    this.showloader = true;
    this.show_add_button = false;
    this.batch_list = [];
    this.teacher_list = [];
    this.batch_id = null;
    this.student_list_details = [];
    this.teachers_time_conflict_details = null;
    this.students_time_conflict_details = null;
    this.day_details = [{
      "id": null,
      "week_day_old" : null,
      "week_day" : null,
      "start_time_temp_old" : null,
      "start_time_temp" : null,
      "start_time" : null,
      "duration_temp_old" : null,
      "duration_temp" : null,
      "duration" : null,
      "teacher_id_old" : null,
      "teacher_id" : null,
      "old_type": 1,
      "type": 1,
      "alt_routine_day_id": null,
      "week_for": null,
      "show_alter_btn": false
    }];

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
      //this.page_type = 'edit';
    }
    
    this.teacher_all();
  }

  async teacher_all() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Loading teacher...',
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

      if(this.batch_id != null) { this.routine_all(); }
    }, async error => {
      if(this.batch_id != null) { this.routine_all(); }

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

  async routine_all() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Loading routine...',
      spinner: 'bubbles'
    });
    loading.present();
    this.showloader = true;

    this.staffWorkService.routine_list(this.batch_id).subscribe(async response => {
      //console.log('Routine list: ', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();
      this.showloader = false;

      if(response.status == true) {
        this.day_details = [];

        response.data.forEach(element => {
          this.day_details.push({
            "id": element.id,
            "week_day_old" : element.week_day,
            "week_day" : element.week_day,
            "start_time_temp_old" : this.format_date(element.start_time),
            "start_time_temp" : this.format_date(element.start_time),
            "start_time" : element.start_time,
            "duration_temp_old" : this.format_date(element.duration),
            "duration_temp" : this.format_date(element.duration),
            "duration" : element.duration,
            "teacher_id_old" : element.teacher_id,
            "teacher_id" : element.teacher_id,
            "old_type": element.type,
            "type": element.type,
            "alt_routine_day_id": element.alt_routine_day_id,
            "week_for": element.temp_week,
            "show_alter_btn": false
          });
        });

        this.show_add_button = true;
      } else {
        const toast = await this.toastController.create({
          message: response.message,
          color: "dark",
          position: "bottom",
          duration: 2000
        });
        toast.present();

        this.show_add_button = false;
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to load routine list!",
        buttons: ['OK']
      });
      alert.present();

      this.show_add_button = false;
    });
  }

  // async batch_student_details() {
  //   //--- Start loader
  //   const loading = await this.loadingController.create({
  //     message: 'Loading student details...',
  //     spinner: 'bubbles'
  //   });
  //   loading.present();
  //   this.showloader = true;

  //   this.staffWorkService.routine_of_students(this.batch_id).subscribe(async response => {
  //     console.log('student details response: ', response);
  //     //--- After get record - dismiss loader
  //     this.loadingController.dismiss();
  //     this.showloader = false;

  //     if(response.status == true) {
  //       this.student_list_details = response.data;
  //     } else {
  //       const toast = await this.toastController.create({
  //         message: response.message,
  //         color: "dark",
  //         position: "bottom",
  //         duration: 2000
  //       });
  //       toast.present();
  //     }
  //   }, async error => {
  //     //--- In case of any error - dismiss loader, show error message
  //     this.loadingController.dismiss();

  //     const alert = await this.alertCtrl.create({
  //       header: 'Error!',
  //       message: "Unable to load student details!",
  //       buttons: ['OK']
  //     });
  //     alert.present();
  //   });
  // }

  add_routine() {
    this.day_details.push({
      "id": null,
      "week_day_old" : null,
      "week_day" : null,
      "start_time_temp_old" : null,
      "start_time_temp" : null,
      "start_time" : null,
      "duration_temp_old" : null,
      "duration_temp" : null,
      "duration" : null,
      "teacher_id_old" : null,
      "teacher_id" : null,
      "old_type": 1,
      "type": 1,
      "alt_routine_day_id": null,
      "week_for": null,
      "show_alter_btn": false
    });

    this.show_add_button = false;
  }

  checkDayTimeAvl(routine_index, field_type) {
    let error = false;
    let count = 0;
    let start_time_temp_select = this.format_time(this.day_details[routine_index].start_time_temp);
    let duration_temp_select = this.format_time(this.day_details[routine_index].duration_temp);
    let end_time_select = null;
    if(start_time_temp_select != null && duration_temp_select != null) {
      end_time_select = this.cal_end_time(start_time_temp_select, duration_temp_select);

      if(this.day_details[routine_index].week_day != null) {
        //--- In every change check teacher is availavle or not
        this.checkTeacherAvl(routine_index, field_type);
      }
    }

    this.day_details.forEach(async element => {
      //--- Skip current filling up routine
      if(count != routine_index) { 
        //--- Check if week-day matched
        if(element.week_day == this.day_details[routine_index].week_day) {
          let start_time_temp = this.format_time(element.start_time_temp); //--- Format into hh:mm
          let duration_temp = this.format_time(element.duration_temp); //--- Format into hh:mm
          
          if(start_time_temp != null && duration_temp != null) {
            let end_time = this.cal_end_time(start_time_temp, duration_temp); //--- Calculate end time, format hh:mm

            //--- If time conflict
            if((start_time_temp_select <= end_time) && (end_time_select >= start_time_temp)) {
              error = true; //--- Set error as true i.e. error found/time conflict

              //--- Check filed input type for which time confliced; wd: work-day dropdown, st: start time input, du: duration input
              if(field_type == 'wd') {
                const toast = await this.toastController.create({
                  message: 'Day conflict with Routine ' + (count+1),
                  color: "dark",
                  position: "bottom",
                  duration: 2000
                });
                toast.present();

                this.day_details[routine_index].week_day = this.day_details[routine_index].week_day_old; //--- Replace by old value
              } else if(field_type == 'st') {
                const toast = await this.toastController.create({
                  message: 'Start time conflict with Routine ' + (count+1),
                  color: "dark",
                  position: "bottom",
                  duration: 2000
                });
                toast.present();

                this.day_details[routine_index].start_time_temp = this.day_details[routine_index].start_time_temp_old; //--- Replace by old value
              } else if(field_type == 'du') {
                const toast = await this.toastController.create({
                  message: 'Duration conflict with Routine ' + (count+1),
                  color: "dark",
                  position: "bottom",
                  duration: 2000
                });
                toast.present();

                this.day_details[routine_index].duration_temp = this.day_details[routine_index].duration_temp_old; //--- Replace by old value
              }
            }
          }
        }
      }

      count++;
    });

    if(!error) {
      this.day_details[routine_index].start_time = start_time_temp_select;
      this.day_details[routine_index].duration = duration_temp_select;
    }
  }

  async checkTeacherAvl(routine_index, field_type = 'wd') {
    let start_time_temp_select = this.format_time(this.day_details[routine_index].start_time_temp); //--- Format hh:mm
    let duration_temp_select = this.format_time(this.day_details[routine_index].duration_temp); //--- Format hh:mm
    let end_time_select = null;

    //--- If (all time related fields are filled up) and (start time or duration or week day or teacher changed)
    if(this.day_details[routine_index].week_day != null && start_time_temp_select != null && duration_temp_select != null && this.day_details[routine_index].teacher_id != null && (this.day_details[routine_index].start_time_temp_old != this.day_details[routine_index].start_time_temp || this.day_details[routine_index].duration_temp_old != this.day_details[routine_index].duration_temp || this.day_details[routine_index].week_day_old != this.day_details[routine_index].week_day || this.day_details[routine_index].teacher_id_old != this.day_details[routine_index].teacher_id)) {

      end_time_select = this.cal_end_time(start_time_temp_select, duration_temp_select); //--- Format hh:mm
      
      //--- Start loader
      const loading = await this.loadingController.create({
        message: 'Checking teacher avilability...',
        spinner: 'bubbles'
      });
      loading.present();
      
      let sendData = {
        batch_id: this.batch_id,
        teacher_id: this.day_details[routine_index].teacher_id,
        week_day: this.day_details[routine_index].week_day,
        start_time : start_time_temp_select,
        end_time: end_time_select
      }
      //console.log('Teacher routine sendData...', sendData);

      this.staffWorkService.teacher_routine_list(sendData).subscribe(async response => {
        //console.log('Teacher routine list...', response);
        //--- After get record - dismiss loader
        this.loadingController.dismiss();
  
        //--- If teacher's time conflict
        if(response.status == true) {
          this.teachers_time_conflict_details = [];
          this.teachers_time_conflict_details = response.data;
          //console.log('this.teachers_time_conflict_details: ', this.teachers_time_conflict_details);
          
          if(this.day_details[routine_index].teacher_id == this.day_details[routine_index].teacher_id_old) {
            this.day_details[routine_index].teacher_id = null;
          } else {
            this.day_details[routine_index].teacher_id = this.day_details[routine_index].teacher_id_old; //--- Set old value
          }
        }
      }, async error => {
        //--- In case of any error - dismiss loader, show error message
        this.loadingController.dismiss();
  
        const alert = await this.alertCtrl.create({
          header: 'Error!',
          message: "Unable to load teacher routine list!",
          buttons: ['OK']
        });
        alert.present();
      });
    }
  }

  format_time(datetime) {
    if(datetime) {
      let datetime_split = datetime.split('T'); //--- After split [0]=> yyyy-mm-dd, [1]=>hh:mm:ss.123+05:30
      let time1_arr = datetime_split[1].split('+'); //--- After split [0]=>hh:mm:ss.123, [1]=>05:30
      let timeonly_arr = time1_arr[0].split(':'); //--- After split [0]=>hh, [1]=>mm, [0]=>ss.123

      return timeonly_arr[0]+':'+timeonly_arr[1]; // Format hh:mm
    } else {
      return null;
    }
  }

  format_date(time) {
    return '2020-01-01T'+time+'.123+05:30'; // Format yyyy-mm-ddThh:mm:ss.123+05:30
  }

  cal_end_time(start_time_temp, duration_temp) {
    let start_time_temp_arr = start_time_temp.split(':'); //--- After split [0]=>hh, [1]=>mm
    let duration_temp_arr = duration_temp.split(':'); //--- After split [0]=>hh, [1]=>mm

    let end_time_hour = +start_time_temp_arr[0] + +duration_temp_arr[0]; //--- +variable means convert variable string to integer
    let end_time_min = +start_time_temp_arr[1] + +duration_temp_arr[1];
    if(end_time_min >= 60) {
      end_time_min = end_time_min%60;
      end_time_hour++;
    }

    let end_time_hour_new = end_time_hour<10 ? '0'+end_time_hour : end_time_hour; // Format hh
    let end_time_min_new = end_time_min<10 ? '0'+end_time_min : end_time_min; // Format mm

    return end_time_hour_new+':'+end_time_min_new; // Format hh:mm
  }

  changeChkbx(routine_index) {
    if(this.day_details[routine_index].type == 1) {
      if( this.day_details[routine_index].old_type == 1 && this.day_details[routine_index].alt_routine_day_id == null) {
        this.day_details[routine_index].show_alter_btn = true;
      }

      this.day_details[routine_index].type = 2;
    } else {
      this.day_details[routine_index].type = 1;
      this.day_details[routine_index].week_for = null;
      this.day_details[routine_index].show_alter_btn = false;
    }
  }

  async onSubmit(routine_index) {
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
    } else if(this.day_details[routine_index].week_day == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select day!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.day_details[routine_index].start_time == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select start time!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.day_details[routine_index].duration == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select duration!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.day_details[routine_index].teacher_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select teacher!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.day_details[routine_index].type == 2 && this.day_details[routine_index].week_for == null) {
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
      
      let sendData = {
        admin_id: this.admin_id,
        batch_id: this.batch_id,
        week_day: this.day_details[routine_index].week_day,
        start_time: this.day_details[routine_index].start_time,
        duration: this.day_details[routine_index].duration,
        teacher_id: this.day_details[routine_index].teacher_id,
        type: this.day_details[routine_index].type,
        week_for: this.day_details[routine_index].week_for
      }
      //console.log('Routine assign sendData: ', sendData);

      this.staffWorkService.routine_day_assign(sendData).subscribe(async response => {
        //console.log('Routine assign response: ', response);
        //--- After record updated - dismiss loader
        this.loadingController.dismiss();

        if(response.status == true) {
          const toast = await this.toastController.create({
            message: response.message,
            color: "dark",
            position: "bottom",
            duration: 2000
          });
          toast.present();

          this.day_details[routine_index].id = response.inserted_id;
          this.day_details[routine_index].week_day_old = this.day_details[routine_index].week_day;
          this.day_details[routine_index].start_time_temp_old = this.day_details[routine_index].start_time_temp;
          this.day_details[routine_index].duration_temp_old = this.day_details[routine_index].duration_temp;
          this.day_details[routine_index].teacher_id_old = this.day_details[routine_index].teacher_id;
          this.show_add_button = true;
        } else {
          if(response.type == 1) {
            this.students_time_conflict_details = [];
            this.students_time_conflict_details = response.data;
            //console.log('Error insert response.data: ', response.data);
          } else {
            const alert = await this.alertCtrl.create({
              header: 'Error!',
              message: response.message,
              buttons: ['OK']
            });
            alert.present();
          }
        }
      }, async error => {
        //console.log('Routine assign error: ', error);
        //--- In case of login error - dismiss loader, show error message
        this.loadingController.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Error!',
          message: "Internal problem!",
          buttons: ['OK']
        });
        alert.present();
      });
    }
  }

  async onUpdate(routine_index) {
    //--- Check empty and invalid credentials
    if(this.day_details[routine_index].id == null || this.batch_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to edit routine!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.day_details[routine_index].week_day == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select day!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.day_details[routine_index].start_time == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select start time!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.day_details[routine_index].duration == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select duration!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.day_details[routine_index].teacher_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select teacher!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.day_details[routine_index].type == 2 && this.day_details[routine_index].week_for == null) {
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
      
      let sendData = {
        id: this.day_details[routine_index].id,
        batch_id: this.batch_id,
        week_day: this.day_details[routine_index].week_day,
        start_time: this.day_details[routine_index].start_time,
        duration: this.day_details[routine_index].duration,
        teacher_id: this.day_details[routine_index].teacher_id,
        type: this.day_details[routine_index].type,
        week_for: this.day_details[routine_index].week_for
      }
      //console.log('Routine edit sendData: ', sendData);

      this.staffWorkService.routine_day_edit(sendData).subscribe(async response => {
        //console.log('Routine edit response: ', response);
        //--- After record updated - dismiss loader
        this.loadingController.dismiss();

        if(response.status == true) {
          const toast = await this.toastController.create({
            message: response.message,
            color: "dark",
            position: "bottom",
            duration: 2000
          });
          toast.present();

          this.day_details[routine_index].old_type = this.day_details[routine_index].type;
          this.day_details[routine_index].week_day_old = this.day_details[routine_index].week_day;
          this.day_details[routine_index].start_time_temp_old = this.day_details[routine_index].start_time_temp;
          this.day_details[routine_index].duration_temp_old = this.day_details[routine_index].duration_temp;
          this.day_details[routine_index].teacher_id_old = this.day_details[routine_index].teacher_id;
          this.day_details[routine_index].show_alter_btn = false;
        } else {
          if(response.type == 1) {
            this.students_time_conflict_details = [];
            this.students_time_conflict_details = response.data;
            //console.log('Error update response.data: ', response.data);
          } else {
            const alert = await this.alertCtrl.create({
              header: 'Error!',
              message: response.message,
              buttons: ['OK']
            });
            alert.present();
          }
        }
      }, async error => {
        console.log('Routine edit error: ', error);
        //--- In case of login error - dismiss loader, show error message
        this.loadingController.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Error!',
          message: "Internal problem!",
          buttons: ['OK']
        });
        alert.present();
      });
    }
  }

  async onAlter(routine_index) {
    //--- Check empty and invalid credentials
    if(this.day_details[routine_index].id == null || this.day_details[routine_index].type == 1 || this.batch_id == null || this.admin_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to alter routine!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.day_details[routine_index].week_day == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select day!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.day_details[routine_index].start_time == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select start time!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.day_details[routine_index].duration == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select duration!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.day_details[routine_index].teacher_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select teacher!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.day_details[routine_index].week_for == null) {
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
      
      let sendData = {
        id: this.day_details[routine_index].id,
        batch_id: this.batch_id,
        admin_id: this.admin_id,
        week_day: this.day_details[routine_index].week_day,
        start_time: this.day_details[routine_index].start_time,
        duration: this.day_details[routine_index].duration,
        teacher_id: this.day_details[routine_index].teacher_id,
        week_for: this.day_details[routine_index].week_for
      }
      //console.log('Routine alter sendData: ', sendData);

      this.staffWorkService.routine_day_alter(sendData).subscribe(async response => {
        //console.log('Routine alter response: ', response);
        //--- After record updated - dismiss loader
        this.loadingController.dismiss();

        if(response.status == true) {
          const toast = await this.toastController.create({
            message: response.message,
            color: "dark",
            position: "bottom",
            duration: 2000
          });
          toast.present();

          this.day_details.push({
            "id": response.inserted_id,
            "week_day_old" : this.day_details[routine_index].week_day,
            "week_day" : this.day_details[routine_index].week_day,
            "start_time_temp_old" : this.day_details[routine_index].start_time_temp,
            "start_time_temp" : this.day_details[routine_index].start_time_temp,
            "start_time" : this.day_details[routine_index].start_time,
            "duration_temp_old" : this.day_details[routine_index].duration_temp,
            "duration_temp" : this.day_details[routine_index].duration_temp,
            "duration" : this.day_details[routine_index].duration,
            "teacher_id_old" : this.day_details[routine_index].teacher_id,
            "teacher_id" : this.day_details[routine_index].teacher_id,
            "old_type": 2,
            "type": 2,
            "alt_routine_day_id": this.day_details[routine_index].id,
            "week_for": this.day_details[routine_index].week_for,
            "show_alter_btn": false
          });

          if(response.type == 1) {
            this.day_details.splice(routine_index, 1);
          }
          
        } else {
          if(response.type == 1) {
            this.students_time_conflict_details = [];
            this.students_time_conflict_details = response.data;
            //console.log('Error alter response.data: ', response.data);
          } else {
            const alert = await this.alertCtrl.create({
              header: 'Error!',
              message: response.message,
              buttons: ['OK']
            });
            alert.present();
          }
        }
      }, async error => {
        console.log('Routine alter error: ', error);
        //--- In case of login error - dismiss loader, show error message
        this.loadingController.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Error!',
          message: "Internal problem!",
          buttons: ['OK']
        });
        alert.present();
      });
    }
  }
  
  async remove_routine(routine_index) {
    //--- If more than one routine remain or just one routine remain but that routine must be temporary and have a alternative routine id
    if(this.day_details.length > 1 || (this.day_details.length == 1 && this.day_details[routine_index].type == 2 && this.day_details[routine_index].alt_routine_day_id != null)) {
      if(this.day_details[routine_index].id == null) {
        //--- This routine yet not submitted, just remove it
        this.day_details.splice(routine_index, 1);
        this.show_add_button = true;
      } else {
        //--- This routine already submitted and have to be remove from databade

        //--- Check empty and invalid credentials
        if(this.day_details[routine_index].id == null || (this.day_details[routine_index].type == 2 && this.day_details[routine_index].alt_routine_day_id == null)) {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: "Unable to remove routine!",
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
          
          let sendData = {
            id: this.day_details[routine_index].id,
            alt_routine_day_id: this.day_details[routine_index].alt_routine_day_id
          }
          //console.log('Routine remove sendData: ', sendData);

          this.staffWorkService.routine_day_remove(sendData).subscribe(async response => {
            //console.log('Routine remove response: ', response);
            //--- After record updated - dismiss loader
            this.loadingController.dismiss();

            if(response.status == true) {
              const toast = await this.toastController.create({
                message: response.message,
                color: "dark",
                position: "bottom",
                duration: 2000
              });
              toast.present();

              if(response.data != null) {
                this.day_details.push({
                  "id": response.data.id,
                  "week_day_old" : response.data.week_day,
                  "week_day" : response.data.week_day,
                  "start_time_temp_old" : this.format_date(response.data.start_time),
                  "start_time_temp" : this.format_date(response.data.start_time),
                  "start_time" : response.data.start_time,
                  "duration_temp_old" : this.format_date(response.data.duration),
                  "duration_temp" : this.format_date(response.data.duration),
                  "duration" : response.data.duration,
                  "teacher_id_old" : response.data.teacher_id,
                  "teacher_id" : response.data.teacher_id,
                  "old_type": response.data.type,
                  "type": response.data.type,
                  "alt_routine_day_id": response.data.alt_routine_day_id,
                  "week_for": response.data.temp_week,
                  "show_alter_btn": false
                });
              }

              if(response.type == 1) {
                this.day_details.splice(routine_index, 1);
              }
              //console.log('this.day_details: ', this.day_details);
              
            } else {
              const alert = await this.alertCtrl.create({
                header: 'Error!',
                message: response.message,
                buttons: ['OK']
              });
              alert.present();
            }
          }, async error => {
            console.log('Routine remove error: ', error);
            //--- In case of login error - dismiss loader, show error message
            this.loadingController.dismiss();
            const alert = await this.alertCtrl.create({
              header: 'Error!',
              message: "Internal problem!",
              buttons: ['OK']
            });
            alert.present();
          });
        }
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

  //--- Function to move selected batch's routine page
  moveRoutineAssign() {
    this.router.navigate(['/routine-assign', {id: this.batch_id}]);
  }

  //--- Function to move selected batch's routine page for time fixing when taecher's time conflict
  moveRoutineAssigntofix(batch_id) {
    this.router.navigate(['/routine-assign', {id: batch_id}]);
  }

  onHideModal() {
    this.teachers_time_conflict_details = null;
  }

  onHideModal2() {
    this.students_time_conflict_details = null;
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
