import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController, LoadingController, Events, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  phone: string = "";
  password: string = "";

  showLoader: boolean;
  showErrorAlert: boolean;
  error_message: string;
  subscription:any;

  constructor(
    private router: Router,
    public menuCtrl: MenuController, 
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public events: Events,
    public userService: UserService,
    private platform: Platform
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    //--- Redirect to home/dashboard if already logged in
    if(this.userService.currentUserValue) { 
      this.menuCtrl.enable(true);
      this.router.navigate(['/course']);
      let currentUser = this.userService.currentUserValue;

      //--- Check if user is either a student or a normal staff (not super admin, whose type is 1)
      if(currentUser.user_type == 'student') {
        if(currentUser.details.type == '1') { //--- If visitor student
          this.router.navigate(['/course']);
        } else if(currentUser.details.type == '2') { //--- If active student
          this.router.navigate(['/course']);
        }
      } else if(currentUser.user_type == 'admin') {
        if(currentUser.details.type == '2') { //--- If councellor staff
          this.router.navigate(['/visitor-students']);
        } else if(currentUser.details.type == '3') { //--- If Academic Head staff
          this.router.navigate(['/batch-assign']);
        }
      }
      
    } else {
      this.menuCtrl.enable(false);
      console.log('Location: LoginComponent');
    }
  }

  ionViewDidEnter(){ 
    this.subscription = this.platform.backButton.subscribe(()=>{ 
      navigator['app'].exitApp(); 
    }); 
  } 

  ionViewWillLeave(){ 
    this.subscription.unsubscribe();
  }

  async onSubmit() {
    var phone_num_format = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/; //--- Numeric, min 10 and max 13, fromat: 9876543210

    //--- Check empty credentials
    if(this.phone.length == 0) {
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
    } else {
      //--- Start loader
      const loading = await this.loadingController.create({
        message: 'Please wait...',
        spinner: 'bubbles'
      });
      loading.present();

      let sendData = {
        username: this.phone,
        password: this.password
      }
      //console.log('Login sendData...', sendData);

      this.userService.login(sendData).subscribe(async response => {
        //console.log('Login response: ', response);
        //--- After successful login - dismiss loader, enable side menu, navigate to dashboard
        this.loadingController.dismiss();
        
        if(response.status == true) {
          //--- Set event data which will access from app component page after login
          this.events.publish('userLogin', {loggedin: true});
          this.menuCtrl.enable(true);

          //--- Check if user is either a student or a normal staff (not super admin, whose type is 1)
          if(response.data.user_type == 'student') {
            if(response.data.details.type == '1') { //--- If visitor student
              this.router.navigate(['/course']);
            } else if(response.data.details.type == '2') { //--- If active student
              this.router.navigate(['/course']);
            }
          } else if(response.data.user_type == 'admin' && response.data.details.type != '1') {
            if(response.data.details.type == '2') { //--- If councellor staff
              this.router.navigate(['/visitor-students']);
            } else if(response.data.details.type == '3') { //--- If Academic Head staff
              this.router.navigate(['/batch-assign']);
            }
          } else {
            this.userService.logout();
            
            const alert = await this.alertCtrl.create({
              header: 'Opps!',
              message: 'Sorry! You are not permitted.',
              buttons: ['OK']
            });
            alert.present();
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
        console.log('Login error: ', error);
        
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
