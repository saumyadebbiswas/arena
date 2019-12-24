import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserService } from '../services';

@Component({
  selector: 'app-applicationoffice',
  templateUrl: './applicationoffice.component.html',
  styleUrls: ['./applicationoffice.component.scss'],
})
export class ApplicationofficeComponent implements OnInit {

  user_type: string;

  constructor(
    private router: Router,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public userService: UserService
  ) { }

  ngOnInit() {}

  ionViewWillEnter(){ 
    console.log('Location: ApplicationofficeComponent');
  }

  movePrevious() {
    this.router.navigate(['/application-activity']);
  }

  moveNext() {
    this.router.navigate(['/application-finish']);
  }

}
