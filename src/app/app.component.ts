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

  user_info: any = [];
  name: string = "Guest";
  phone: string = "0000000000";
  public appPages = [];

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
      	   
      this.user_info = this.userService.currentUserValue;
      //console.log('Logged user details...', this.user_info);
      if(this.user_info.details.name != null) {
        this.name = this.user_info.details.name;
        this.phone = this.user_info.details.phone;
      }

      //--- Select user type and load menu tabs accordingly
      if(this.user_info.user_type == 'student') {
        this.appPages = [
          {
            title: 'Courses',
            url: '/course',
            icon: 'list'
          },
          {
            title: 'Student Artwork',
            url: '/art-work',
            icon: 'list'
          },
          {
            title: 'Placement Record',
            url: '/placement',
            icon: 'list'
          },
          {
            title: 'Infrastructure',
            url: '/infrastructure',
            icon: 'list'
          },
          {
            title: 'Videos',
            url: '/videos',
            icon: 'list'
          }
        ];
      } else if(this.user_info.user_type == 'admin') {
        this.appPages = [
          {
            title: 'Register Students',
            url: '/reg-students',
            icon: 'list'
          },
          {
            title: 'Batch Create',
            url: '/student-batch',
            icon: 'list'
          },
          {
            title: 'Routine Create',
            url: '/routine',
            icon: 'list'
          }
        ];
      }
    }

    //--- Get event data set at login time from login page
    events.subscribe('userLogin', (data) => {
      //--- Get logged cuurent user details
      if(this.userService.currentUserValue) {
        this.menuCtrl.enable(true);

        this.user_info = this.userService.currentUserValue;
        //console.log('Logged user details event...', this.user_info);
        if(this.user_info.details.name != null) {
          this.name = this.user_info.details.name;
          this.phone = this.user_info.details.phone;
        }

        //--- Select user type and load menu tabs accordingly
        if(this.user_info.user_type == 'student') {
          this.appPages = [
            {
              title: 'Courses',
              url: '/course',
              icon: 'list'
            },
            {
              title: 'Student Artwork',
              url: '/art-work',
              icon: 'list'
            },
            {
              title: 'Placement Record',
              url: '/placement',
              icon: 'list'
            },
            {
              title: 'Infrastructure',
              url: '/infrastructure',
              icon: 'list'
            },
            {
              title: 'Videos',
              url: '/videos',
              icon: 'list'
            }
          ];
        } else if(this.user_info.user_type == 'admin') {
          this.appPages = [
            {
              title: 'Register Students',
              url: '/reg-students',
              icon: 'list'
            },
            {
              title: 'Batch Create',
              url: '/student-batch',
              icon: 'list'
            },
            {
              title: 'Routine Create',
              url: '/routine',
              icon: 'list'
            }
          ];
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

  moveApplicationForm() {
    this.menuCtrl.close();
    
    //--- Select user type and forward to application form page accordingly
    if(this.user_info.user_type == 'admin') {
      this.router.navigate(['/application-personal', {type: 'insert', id: null}]);
    } else if(this.user_info.user_type == 'student') {
      let student_id = this.user_info.details.id;
      this.router.navigate(['/application-personal', {type: 'edit', id: student_id}]);
    }
  }

  signOut() {
    this.menuCtrl.close();
    this.menuCtrl.enable(false);
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
