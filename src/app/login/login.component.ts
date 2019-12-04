import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController, LoadingController, Events } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  username: string = "";
  password: string = "";
  showLoader: boolean;
  showErrorAlert: boolean;
  error_message: string;

  constructor(
    private router: Router,
    public menuCtrl: MenuController, 
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public events: Events,
    public userService: UserService
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    //--- Redirect to home/dashboard if already logged in
    if(this.userService.currentUserValue) { 
      this.menuCtrl.enable(true);
      this.router.navigate(['/home']);
    } else {
      this.menuCtrl.enable(false);
      console.log('Location: LoginComponent');
    }
  }

  async onSubmit() {
    //--- Check empty credentials
    if(this.username.length == 0 || this.password.length == 0) {

      this.showErrorAlert = true;
      this.error_message = "Enter full credentials!";

    } else {
      //--- Start loader
      const loading = await this.loadingController.create({
        message: 'Please wait...',
        spinner: 'bubbles'
      });
      loading.present();

      let sendData = {
        username: this.username,
        password: this.password
      }
      //console.log('sendData...', sendData);

      this.userService.login(sendData).subscribe(async response => {
        console.log('Login response...', response);
        //--- After successful login - dismiss loader, enable side menu, navigate to dashboard
        this.loadingController.dismiss();

        if(response.status == true) {
          //--- Set event data which will access from app component page after login
          this.events.publish('userLogin', {loggedin: true});
          this.menuCtrl.enable(true);
          this.router.navigate(['/home']);
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: response.message,
            buttons: ['OK']
            });
          alert.present();
        }
      }, async error => {
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
