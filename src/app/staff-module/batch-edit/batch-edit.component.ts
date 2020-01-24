import { Component, OnInit } from '@angular/core';
import { VisitorsService, UserService, StaffWorkService } from 'src/app/services';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-batch-edit',
  templateUrl: './batch-edit.component.html',
  styleUrls: ['./batch-edit.component.scss'],
})
export class BatchEditComponent implements OnInit {

  showloader: boolean = true;
  course_list: any = [];
  active_student_list: any;
  batch_name: string;
  course_id: string;
  start_date: string;
  minDate: any;
  maxDate: any;
  admin_id: string;
  checkbox_list: any;
  batch_id: string;
  students_assign: any;
  is_show_modal: boolean;
  count_students_assign_chkd: number;
  today_timestamp: any;
  batch_date_status: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public visitorsService: VisitorsService,
    public staffWorkService: StaffWorkService,
    public userService: UserService
  ) {
    let user_info = this.userService.currentUserValue;
    this.admin_id = user_info.details.id;
  }

  ngOnInit() { }

  ionViewWillEnter() {
    console.log('Location: BatchEditComponent');

    this.active_student_list = [];
    this.students_assign = [];
    this.batch_id = this.route.snapshot.paramMap.get('id');
    this.batch_name = "";
    this.course_id = null;
    this.start_date = null;
    this.minDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(); //--- Get tommorow date as min date
    this.maxDate = new Date(new Date().setDate(new Date().getDate() + 365)).toISOString(); //--- Add one year to get max date
    this.checkbox_list = [];
    this.is_show_modal = false;
    this.count_students_assign_chkd = 1; //--- Assign student checked by default 1 because we need minimum must remain
    let today = ""+Date.now(); //--- Get today's date-time timestamp
    this.today_timestamp = today.substring(0,5); //--- Substract today's date timestamp
    this.batch_date_status = -1; //--- -1:Undefined, 1:Yet not started, 2:Started today, 3:Start date crossed

    this.batch_detail();
  }

  async batch_detail() {
    //--- Start loader
    this.showloader = true;
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.staffWorkService.batch_details(this.batch_id).subscribe(async response => {
      //console.log('Batch details response: ', response);
      //--- After get record - dismiss loader
      this.showloader = false;
      this.loadingController.dismiss();

      if(response.status == true) {
        this.batch_name = response.data.name;
        this.course_id = response.data.course_id;
        this.start_date = response.data.start_date;

        let start_date_timestamp = ""+Date.parse(this.start_date); //--- Convert start_date into date-time _timestamp
        start_date_timestamp = start_date_timestamp.substring(0,5); //--- Substract start_date's date timestamp
        //console.log('Today, start_day', this.today_timestamp, start_date_timestamp);
        
        if(+start_date_timestamp > +this.today_timestamp) {
          this.batch_date_status = 1; //--- Yet not started
        } else if(+start_date_timestamp == +this.today_timestamp) {
          this.batch_date_status = 2; //--- Started today
        } else if(+start_date_timestamp < +this.today_timestamp) {
          this.batch_date_status = 3; //--- Start date crossed
        } else {
          this.batch_date_status = -1; //--- If any error, undefined
        }

        response.data.students.forEach(element => {
          element.isChecked = false; //-- Set by default all checkbox unchecked
          this.students_assign.push(element);
        });
        //console.log('this.students_assign: ', this.students_assign);
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Error!',
          message: response.message,
          buttons: ['OK']
        });
        alert.present();
      }
      
      this.course_all();
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.loadingController.dismiss(); 
      this.showloader = false;

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to load details!",
        buttons: ['OK']
      });
      alert.present();

      this.course_all();
    });
  }

  async course_all() {
    //--- Start loader
    this.showloader = true;
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.visitorsService.course_list().subscribe(async response => {
      //console.log('Course list...', response);
      //--- After get record - dismiss loader
      this.showloader = false;
      this.loadingController.dismiss();

      if(response.status == true) {
        this.course_list = response.data;
      }
      
      this.activeStudent_list();
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.loadingController.dismiss(); this.showloader = false;

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to load courses!",
        buttons: ['OK']
      });
      alert.present();

      this.activeStudent_list();
    });
  }

  async activeStudent_list() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();
    this.showloader = true;

    this.staffWorkService.active_student_list().subscribe(async response => {
      //console.log('Active student list...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();
      this.showloader = false;

      let temp_find_list = [];
      let temp_not_find_list = [];

      if(response.status == true) {
        response.data.forEach(element => {
          //--- Old logic || Not require || From active student list reomve those students who already assigned in this batch
          // if(this.students_assign.find(ob => ob['student_id'] === element.id) == null) {
          //   element.isChecked = false; //-- Set by default all checkbox unchecked
          //   this.active_student_list.push(element);
          // }

          if(element.applied_course_id == this.course_id) {;
            element.isChecked = false; //-- Set by default all checkbox unchecked
            element.isDisabled = false; //-- Set course wise selected students checkbox enable
            element.find_mark = '*'; //-- Set course wise selected students a find mark
            temp_find_list.push(element)
          } else {
            element.isChecked = false; //-- Set by default all checkbox unchecked
            element.isDisabled = true; //-- Set other students checkbox disable
            element.find_mark = ''; //-- Set other students find mark as blank
            temp_not_find_list.push(element);
          }
        });

        //--- To short list the selected students at the top
        temp_find_list.forEach(element => {
          this.active_student_list.push(element);
        });
        temp_not_find_list.forEach(element => {
          element.find_mark = '';
          this.active_student_list.push(element);
        });
      } else {
        const toast = await this.toastController.create({
          message: response.message,
          color: "dark",
          position: "bottom",
          duration: 2000
        });
        toast.present();
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.loadingController.dismiss();
      this.showloader = false;

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to load courses!",
        buttons: ['OK']
      });
      alert.present();
    });
  }

  filter_student_by_course(event) {
    let course_id = event.target.value;
    //console.log('Selected course_id: ', course_id);
    
    if(this.active_student_list.length != 0) {
      let temp_find_list = [];
      let temp_not_find_list = [];
      
      this.active_student_list.forEach(element => {
        if(element.applied_course_id == course_id) {;
          element.isDisabled = false; //-- Set course wise selected students checkbox enable
          element.find_mark = '*'; //-- Set course wise selected students a find mark
          temp_find_list.push(element)
        } else {
          element.isDisabled = true; //-- Set other students checkbox disable
          element.find_mark = ''; //-- Set other students find mark as blank
          temp_not_find_list.push(element);
        }
      });

      //--- To short list the selected students at the top
      this.active_student_list = [];
      temp_find_list.forEach(element => {
        this.active_student_list.push(element);
      });
      temp_not_find_list.forEach(element => {
        element.find_mark = '';
        this.active_student_list.push(element);
      });
      //console.log('Sorted student list: ', this.active_student_list);
    }
  }

  changeChkbx(student_id) {
    let i = 0;
    this.active_student_list.forEach(element => {
      if(element.id == student_id && element.isChecked) {
        this.active_student_list[i].isChecked = false;
      } else if(element.id == student_id && !element.isChecked) {
        this.active_student_list[i].isChecked = true;
      }
      i++;
    });
    //console.log('Active student list: ', this.active_student_list);
  }

  changeASChkbx(index) {
    if(this.students_assign[index].isChecked) {
      this.students_assign[index].isChecked = false;
      this.count_students_assign_chkd--;
    } else if(!this.students_assign[index].isChecked) {
      this.students_assign[index].isChecked = true;
      this.count_students_assign_chkd++;
    }
    //console.log('Assigned student list: ', this.students_assign);
  }

  async onUpdate() {
    let students_new = [];
    this.active_student_list.forEach(element => {
      if(element.isChecked) {
        students_new.push({'student_id': element.id});
      }
    });
    
    let students_remove = [];
    this.students_assign.forEach(element => {
      if(element.isChecked) {
        students_remove.push({
          'id': element.id,
          'student_id': element.student_id
        });
      }
    });

    //--- Check empty and invalid credentials
    if(this.batch_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to update!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.batch_name.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter batch name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.course_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select course!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.start_date == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select start date!",
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

      let date_split = this.start_date.split('T');
      this.start_date = date_split[0];
      
      let sendData = {
        id: this.batch_id,
        name: this.batch_name,
        course_id: this.course_id,
        start_date: this.start_date,
        students_new: students_new,
        students_remove: students_remove
      }
      //console.log('Batch edit sendData: ', sendData);

      this.staffWorkService.batch_edit(sendData).subscribe(async response => {
        //console.log('Batch edit response: ', response);
        //--- After record updated - dismiss loader
        this.loadingController.dismiss();

        if(response.status == true) {
          if(response.type == 1) {
            console.log('Conflict students data: ', response.data);
            
            const toast = await this.toastController.create({
              message: response.message,
              color: "dark",
              position: "bottom",
              duration: 2000
            });
            toast.present();

            this.router.navigate(['/batch-list']);
          } else {
            const toast = await this.toastController.create({
              message: response.message,
              color: "dark",
              position: "bottom",
              duration: 2000
            });
            toast.present();

            this.router.navigate(['/batch-list']);
          }
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: response.message,
            buttons: ['OK']
          });
          alert.present();
        }
      }, async error => {
        console.log('Batch edit error: ', error);
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

  onShowModal() {
    this.is_show_modal = true;
  }

  onHideModal() {
    this.is_show_modal = false;
  }

  async onRemove() {
    this.is_show_modal = false;

    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.staffWorkService.batch_remove(this.batch_id).subscribe(async response => {
      //console.log('Batch remove response: ', response);
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

        this.router.navigate(['/batch-list']);
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Error!',
          message: response.message,
          buttons: ['OK']
        });
        alert.present();
      }
    }, async error => {
      console.log('Batch remove error: ', error);
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
