import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserService } from '../services';

@Component({
  selector: 'app-applicationeducation',
  templateUrl: './applicationeducation.component.html',
  styleUrls: ['./applicationeducation.component.scss'],
})
export class ApplicationeducationComponent implements OnInit {
  
  user_type: string;

  constructor(
    private router: Router,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public userService: UserService
  ) { }

  ngOnInit() {}

  ionViewWillEnter(){ 
    if(this.userService.currentUserValue == null) {
      this.router.navigate(['/login']);
    } else {
      console.log('Location: ApplicationeducationComponent');

      this.user_type = this.userService.currentUserValue.user_type;
    }
  }

  movePrevious() {
    this.router.navigate(['/application-personal']);
  }

  moveNext() {
    this.router.navigate(['/application-activity']);
  }

}
