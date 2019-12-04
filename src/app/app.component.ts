import { Component } from '@angular/core';

import { Platform, MenuController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { UserService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  user_details: any = [];
  name: string;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Landing',
      url: '/landind',
      icon: 'list'
    },
    {
      title: 'Courses',
      url: '/list',
      icon: 'list'
    }
  ];

  constructor(
    public menuCtrl: MenuController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public userService: UserService,
    public events: Events
  ) {
    this.initializeApp();

    //--- Get logged cuurent user details in case of page refresh (usually not happen)
    if(this.userService.currentUserValue) {	
      this.menuCtrl.enable(true);
      	   
      this.user_details = this.userService.currentUserValue;
      // console.log('Logged user details...', this.user_details);
      if(this.user_details.name != null) {
        this.name = this.user_details.name;
      }
    }

    //--- Get event data set at login time from login page
    events.subscribe('userLogin', (data) => {
      this.menuCtrl.enable(true);
      // console.log('Login event data...', data.loggedin);

      //--- Get logged cuurent user details
      if(this.userService.currentUserValue) {		   
        this.user_details = this.userService.currentUserValue;
        // console.log('Logged user details event...', this.user_details);
        if(this.user_details.name != null) {
          this.name = this.user_details.name;
        }
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  signOut() {
    this.menuCtrl.close();
    this.menuCtrl.enable(false);
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
