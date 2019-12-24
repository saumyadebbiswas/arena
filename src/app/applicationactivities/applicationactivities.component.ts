import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserService } from '../services';

@Component({
  selector: 'app-applicationactivities',
  templateUrl: './applicationactivities.component.html',
  styleUrls: ['./applicationactivities.component.scss'],
})
export class ApplicationactivitiesComponent implements OnInit {

  user_type: string;

  constructor(
    private router: Router,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public userService: UserService
  ) { }

  ngOnInit() {}

  ionViewWillEnter() { 
    if(this.userService.currentUserValue == null) {
      this.router.navigate(['/login']);
    } else {
      console.log('Location: ApplicationactivitiesComponent');

      this.user_type = this.userService.currentUserValue.user_type;
    }
  }

  movePrevious() {
    this.router.navigate(['/application-education']);
  }

  moveNext() {
    if(this.user_type == 'admin') {
      this.router.navigate(['/application-official']);
    } else if(this.user_type == 'student') {
      this.router.navigate(['/application-finish']);
    }
  }

}
