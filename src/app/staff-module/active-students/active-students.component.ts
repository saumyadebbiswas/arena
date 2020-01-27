import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserService, VisitorsService } from 'src/app/services';
import { SITE_URL } from 'src/app/services/constants';

@Component({
  selector: 'app-active-students',
  templateUrl: './active-students.component.html',
  styleUrls: ['./active-students.component.scss'],
})
export class ActiveStudentsComponent implements OnInit {
  
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
    public visitorsService: VisitorsService
  ) {
    this.site_url = SITE_URL;
  }

  ngOnInit() {}

  ionViewWillEnter() { 
    console.log('Location: ActiveStudentsComponent');
    this.active_student_all();
  }

  async active_student_all() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();
    
    let sendData = {
      type: 2
    }
    //console.log('Routine assign sendData: ', sendData);

    this.visitorsService.student_type_list(sendData).subscribe(async response => {
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
