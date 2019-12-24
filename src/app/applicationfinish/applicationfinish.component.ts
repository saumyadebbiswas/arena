import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services';

@Component({
  selector: 'app-applicationfinish',
  templateUrl: './applicationfinish.component.html',
  styleUrls: ['./applicationfinish.component.scss'],
})
export class ApplicationfinishComponent implements OnInit {

  user_type: string;

  constructor(
    private router: Router,
    public userService: UserService
  ) { }

  ngOnInit() {}

  ionViewWillEnter() { 
    if(this.userService.currentUserValue == null) {
      this.router.navigate(['/login']);
    } else {
      console.log('Location: ApplicationfinishComponent');

      this.user_type = this.userService.currentUserValue.user_type;
    }
  }

}
