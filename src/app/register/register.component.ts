import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

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

  constructor(
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {}

}
