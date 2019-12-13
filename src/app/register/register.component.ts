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

  name: string = "";
  email: string = "";
  phone: string = "";
  password: string = "";
  course_id: string = null;
  course_list: any = [];

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
      console.log('Course list...', response);
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
    //--- Check empty credentials
    if(this.name.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter name!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.email.length == 0 && this.phone.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter either email ID or phone number!",
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
