import { Component, OnInit } from '@angular/core';
import { VisitorsService, UserService, StaffWorkService } from 'src/app/services';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-batch-assign',
  templateUrl: './batch-assign.component.html',
  styleUrls: ['./batch-assign.component.scss'],
})
export class BatchAssignComponent implements OnInit {

  showloader: boolean;
  course_list: any;
  active_student_list: any;
  batch_name: string;
  course_id: string;
  start_date: string;
  //today_date: String = new Date().toISOString();
  minDate: any;
  maxDate: any;
  admin_id: string;
  checkbox_list: any;

  constructor(
    private router: Router,
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

  ngOnInit() {}

  ionViewWillEnter() {
    console.log('Location: BatchAssignComponent');
    
    this.showloader = false;
    this.course_list = [];
    this.active_student_list = [];
    this.batch_name = "";
    this.course_id = null;
    this.start_date = null;
    this.minDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(); //--- Get tommorow date as min date
    this.maxDate = new Date(new Date().setDate(new Date().getDate() + 365)).toISOString(); //--- Add one year to get max date
    this.checkbox_list = [];
    
    this.course_all();
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
      //console.log('Active student list response: ', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();
      this.showloader = false;

      if(response.status == true) {
        response.data.forEach(element => {
          element.isChecked = false; //-- Set by default all checkbox unchecked
          element.isDisabled = true; //-- Set by default all checkbox disable
          element.find_mark = ''; //-- Set other students find mark as blank
          this.active_student_list.push(element);
        });
        //console.log('Active student list: ', this.active_student_list);
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
    //console.log(this.active_student_list);
  }

  async onSubmit() {
    let selected_student = [];
    this.active_student_list.forEach(element => {
      if(element.isChecked) {
        selected_student.push({'student_id': element.id});
      }
    });

    //--- Check empty and invalid credentials
    if(this.admin_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to assign batch!",
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
    } else if(selected_student.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select student!",
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
        admin_id: this.admin_id,
        name: this.batch_name,
        course_id: this.course_id,
        start_date: this.start_date,
        student_ids: selected_student
      }
      //console.log('Batch assign sendData: ', sendData);

      this.staffWorkService.batch_insert(sendData).subscribe(async response => {
        //console.log('Batch assign response: ', response);
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
        console.log('Batch assign error: ', error);
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

}
