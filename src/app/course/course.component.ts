import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
  
  subscription:any;

  constructor(
    private router: Router,
    public userService: UserService,
    private platform: Platform
  ) { }

  ngOnInit() {}

  ionViewWillEnter(){ 
    if(this.userService.currentUserValue == null) {
      this.router.navigate(['/login']);
    }
    console.log('Location: CourseComponent');
  }

  ionViewDidEnter(){ 
    this.subscription = this.platform.backButton.subscribe(()=>{ 
      navigator['app'].exitApp(); 
    }); 
  } 

  ionViewWillLeave(){ 
    this.subscription.unsubscribe();
  }

}
