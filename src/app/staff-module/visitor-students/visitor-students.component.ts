import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, AlertController, LoadingController } from '@ionic/angular';
import { UserService, VisitorsService } from 'src/app/services';
import { SITE_URL } from 'src/app/services/constants';

@Component({
  selector: 'app-visitor-students',
  templateUrl: './visitor-students.component.html',
  styleUrls: ['./visitor-students.component.scss'],
})
export class VisitorStudentsComponent implements OnInit {
  
  subscription:any;
  message: string = "Loading...";
  student_list_fix: any = [];
  student_list: any = [];
  site_url: string;
  user_type: string;

  constructor(
    private router: Router,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public userService: UserService,
    public visitorsService: VisitorsService,
    private platform: Platform
  ) {
    this.site_url = SITE_URL;
  }

  ngOnInit() {}

  ionViewWillEnter() { 
    console.log('Location: RegisterStudentComponent');
    this.reg_student_all();
  }

  ionViewDidEnter(){ 
    this.subscription = this.platform.backButton.subscribe(()=>{ 
      navigator['app'].exitApp(); 
    }); 
  } 

  ionViewWillLeave(){ 
    this.subscription.unsubscribe();
  }

  async reg_student_all() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.visitorsService.register_student_list().subscribe(async response => {
      //console.log('Register student list...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.student_list_fix = response.data;
        this.student_list = response.data;
      } else {
        this.message = "No Student Available!"
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.message = "Unable load data!"
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Oops! Internal problem.",
        buttons: ['OK']
      });
      alert.present();
    });
  }
  
  updateList(event) {
    let search_value = event.target.value;

    this.student_list = [];

    if(search_value.length >= 3) {
      this.student_list_fix.forEach(element => {
        let name = element.name.toLowerCase();
        search_value = search_value.toLowerCase();

        if(name.includes(search_value)){
          this.student_list.push(element);
        }
      });
    } else {
      this.student_list = this.student_list_fix;
    }
  }

  moveApplicationForm(student_id) {
    this.router.navigate(['/application-personal', {type: 'edit', id: student_id}]);
  }

}
