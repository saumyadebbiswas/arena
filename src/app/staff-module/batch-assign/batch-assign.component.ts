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

  course_list: any = [];
  active_student_list: any = [];
  course_id: string = null;

  checkbox_list: any = [];

  constructor(
    private router: Router,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public visitorsService: VisitorsService,
    public staffWorkService: StaffWorkService,
    public userService: UserService
  ) { }

  ngOnInit() {}

  ionViewWillEnter() { 
    if(this.userService.currentUserValue == null) {
      this.router.navigate(['/login']);
    } else {
      console.log('Location: BatchAssignComponent');

      this.course_all();
    }
    
  }

  async course_all() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.visitorsService.course_list().subscribe(async response => {
      //console.log('Course list...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.course_list = response.data;
      }
      
      this.activeStudent_list();
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.loadingController.dismiss();

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

    this.staffWorkService.active_student_list().subscribe(async response => {
      //console.log('Active student list...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.active_student_list = response.data;
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
        this.active_student_list.push(element);
      });
      temp_not_find_list.forEach(element => {
        this.active_student_list.push(element);
      });
      //console.log('Sorted student list: ', this.active_student_list);
    }
  }

}
