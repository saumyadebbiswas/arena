import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService, VisitorsService } from '../services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  course_id: string;
  course_list: any;

  constructor(
    public menuCtrl: MenuController,
    private router: Router, 
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public visitorsService: VisitorsService,
    public userService: UserService
  ) {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {}

  ionViewWillEnter() {
    //--- Redirect to home/dashboard if already logged in
    if(this.userService.currentUserValue) { 
      this.menuCtrl.enable(true);
      this.router.navigate(['/home']);
    } else {
      this.menuCtrl.enable(false);
      console.log('Location: RegisterComponent');

      this.name = "";
      this.email = "";
      this.phone = "";
      this.password = "";
      this.confirm_password = "";
      this.course_id = null;
      this.course_list = [];

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
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "internal Error! Unable to load courses.",
        buttons: ['OK']
      });
      alert.present();
    });
  }

  async onSubmit() {
    var mail_format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //--- String, format: demo@domain.co

    var phone_num_format = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/; //--- Numeric, min 10 and max 13, fromat: 9876543210

    //--- Check empty credentials
    if(this.name.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter name!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.email.length != 0 && (!mail_format.test(this.email))) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid email ID!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.phone.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter phone number!",
        buttons: ['OK']
        });
      alert.present();
    } else if(!phone_num_format.test(this.phone)) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid phone number!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.password.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter password!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.confirm_password.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter confirm password!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.password != this.confirm_password) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Confirm password not matched!",
        buttons: ['OK']
        });
      alert.present();

      this.confirm_password = "";
    } else if(this.course_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select course of interest!",
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
        name: this.name,
        email: this.email,
        phone: this.phone,
        password: this.password,
        course_id: this.course_id
      }
      //console.log('Register sendData...', sendData);

      this.userService.register(sendData).subscribe(async response => {
        //console.log('Register response...', response);
        //--- After record insert - dismiss loader, navigate to login
        this.loadingController.dismiss();

        if(response.status == true) {
          const alert = await this.alertCtrl.create({
            header: 'Thank You!',
            message: "Registration successfull.",
            buttons: ['OK']
            });
          alert.present();

          this.router.navigate(['/login']);
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: response.message,
            buttons: ['OK']
            });
          alert.present();
        }
      }, async error => {
        console.log('Register error...', error);

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
