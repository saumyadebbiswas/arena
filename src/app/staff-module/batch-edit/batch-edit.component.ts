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
  active_student_list: any = [];
  batch_name: string = "";
  course_id: string = null;
  start_date: string = null;
  minDate: String = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(); //--- Get tommorow date as min date
  maxDate: any = new Date(new Date().setDate(new Date().getDate() + 365)).toISOString(); //--- Add one year to get max date
  admin_id: string;
  checkbox_list: any = [];
  batch_id: string = null;
  students_assign: any = [];

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
        response.data.students.forEach(element => {
          element.isChecked = false; //-- Set by default all checkbox unchecked
          this.students_assign.push(element);
        });
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

      if(response.status == true) {
        response.data.forEach(element => {
          if(this.students_assign.find(ob => ob['student_id'] === element.id) == null) {
            element.isChecked = false; //-- Set by default all checkbox unchecked
            this.active_student_list.push(element);
          }
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
        if(element.applied_course_id == course_id) {
          temp_find_list.push(element);
        } else {
          temp_not_find_list.push(element);
        }
      });

      this.active_student_list = [];
      temp_find_list.forEach(element => {
        element.find_mark = '*';
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

  changeASChkbx(batch_stu_id) {
    let i = 0;
    this.students_assign.forEach(element => {
      if(element.id == batch_stu_id && element.isChecked) {
        this.students_assign[i].isChecked = false;
      } else if(element.id == batch_stu_id && !element.isChecked) {
        this.students_assign[i].isChecked = true;
      }
      i++;
    });
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
        students_remove.push({'id': element.id});
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

}
