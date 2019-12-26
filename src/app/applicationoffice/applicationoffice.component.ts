import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserService, VisitorsService } from '../services';

@Component({
  selector: 'app-applicationoffice',
  templateUrl: './applicationoffice.component.html',
  styleUrls: ['./applicationoffice.component.scss'],
})
export class ApplicationofficeComponent implements OnInit {

  show_conf_button: boolean = false;
  campus_list: any = [];

  student_id: string = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public visitorsService: VisitorsService,
    public userService: UserService
  ) { }

  ngOnInit() {}

  ionViewWillEnter(){ 
    console.log('Location: ApplicationofficeComponent');

    this.student_id = this.route.snapshot.paramMap.get('id');

    this.campus_all();
  }

  async campus_all() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.visitorsService.campus_list().subscribe(async response => {
      console.log('Campus list details...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.campus_list = response.data;
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to load campus list.",
        buttons: ['OK']
      });
      alert.present();
    });
  }

  movePrevious() {
    this.router.navigate(['/application-activity', {id: this.student_id}]);
  }

  confirm() {
    this.router.navigate(['/application-finish']);
  }

}
