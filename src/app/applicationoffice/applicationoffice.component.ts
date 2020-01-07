import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { UserService, VisitorsService, ApplicationService } from '../services';

@Component({
  selector: 'app-applicationoffice',
  templateUrl: './applicationoffice.component.html',
  styleUrls: ['./applicationoffice.component.scss'],
})
export class ApplicationofficeComponent implements OnInit {

  show_conf_button: boolean = false;
  campus_list: any = [];
  admin_id: string;
  admin_name: string;
  id: string = null;
  minDate: String = new Date(new Date().setDate(new Date().getDate() - 365)).toISOString(); //--- Remove one year as min date
  maxDate: any = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(); //--- Add one month to get max date

  student_id: string = null;
  accept_at: string = "";
  confirm_no: string = "";
  campus_id: string = null;
  date: string = null;
  roll_no: string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public alertCtrl: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public visitorsService: VisitorsService,
    public applicationService: ApplicationService,
    public userService: UserService
  ) {
    let user_info = this.userService.currentUserValue;
    this.admin_id = user_info.details.id;
    this.admin_name = user_info.details.name;
  }

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
      //console.log('Campus list details...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.campus_list = response.data;
      }

      this.official_details();
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to load campus list.",
        buttons: ['OK']
      });
      alert.present();

      this.official_details();
    });
  }

  async official_details() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.applicationService.official_detail(this.student_id).subscribe(async response => {
      //console.log('Official details: ', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.id = response.data[0].id;
        this.accept_at = response.data[0].accept_at;
        this.confirm_no = response.data[0].confirm_no;
        this.campus_id = response.data[0].campus_id;
        this.date = response.data[0].date;
        this.roll_no = response.data[0].roll_no;

        this.show_conf_button = true;
      } else {
        const toast = await this.toastController.create({
          message: response.message,
          color: "dark",
          position: "bottom",
          duration: 2000
        });
        toast.present();

        this.show_conf_button = false;
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to load activity details!",
        buttons: ['OK']
      });
      alert.present();
    });
  }

  async onSubmit() {
    //--- Check empty and invalid credentials
    if(this.student_id == null || this.admin_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "unable to submit!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.accept_at.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter accept location!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.confirm_no.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter confirmation number!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.campus_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select campus!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.date == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.roll_no.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter roll number!",
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

      let date_split = this.date.split('T');
      this.date = date_split[0];
      
      let sendData = {
        student_id: this.student_id,
        staff_id: this.admin_id,
        accept_at: this.accept_at,
        confirm_no: this.confirm_no,
        campus_id: this.campus_id,
        date: this.date,
        roll_no: this.roll_no
      }
      //console.log('Application official update sendData: ', sendData);

      this.applicationService.official_insert(sendData).subscribe(async response => {
        //console.log('Application official update response: ', response);
        //--- After record updated - dismiss loader
        this.loadingController.dismiss();

        if(response.status == true) {
          const toast = await this.toastController.create({
            message: response.message,
            color: "dark",
            position: "bottom",
            duration: 2000
          });
          toast.present();

          this.id = response.inserted_id;
          this.show_conf_button = true;
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: response.message,
            buttons: ['OK']
          });
          alert.present();
        }
      }, async error => {
        console.log('Application Official update error: ', error);
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

  async onUpdate() {
    //--- Check empty and invalid credentials
    if(this.id == null || this.student_id == null || this.admin_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "unable to submit!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.accept_at.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter accept location!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.confirm_no.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter confirmation number!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.campus_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select campus!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.date == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.roll_no.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter roll number!",
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

      let date_split = this.date.split('T');
      this.date = date_split[0];
      
      let sendData = {
        id: this.id,
        student_id: this.student_id,
        staff_id: this.admin_id,
        accept_at: this.accept_at,
        confirm_no: this.confirm_no,
        campus_id: this.campus_id,
        date: this.date,
        roll_no: this.roll_no
      }
      //console.log('Application official edit sendData: ', sendData);

      this.applicationService.official_update(sendData).subscribe(async response => {
        //console.log('Application official edit response: ', response);
        //--- After record insert - dismiss loader
        this.loadingController.dismiss();

        if(response.status == true) {
          const toast = await this.toastController.create({
            message: response.message,
            color: "dark",
            position: "bottom",
            duration: 2000
          });
          toast.present();
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: response.message,
            buttons: ['OK']
          });
          alert.present();
        }
      }, async error => {
        console.log('Application Official error: ', error);
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

  movePrevious() {
    this.router.navigate(['/application-activity', {id: this.student_id}]);
  }

  async confirm() {
    //--- Check empty and invalid credentials
    if(this.id == null || this.student_id == null || this.admin_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "unable to confirm!",
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
        id: this.id,
        student_id: this.student_id,
        staff_id: this.admin_id
      }
      //console.log('Application official confirm sendData: ', sendData);

      this.applicationService.official_confirm(sendData).subscribe(async response => {
        //console.log('Application official confirm response: ', response);
        //--- After record confirm - dismiss loader
        this.loadingController.dismiss();

        if(response.status == true) {

          this.router.navigate(['/application-finish']);

        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: response.message,
            buttons: ['OK']
          });
          alert.present();
        }
      }, async error => {
        console.log('Application Official confirm error: ', error);
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

  async tooltipMsg(message) {
    const toast = await this.toastController.create({
      message: message,
      color: "dark",
      position: "bottom",
      duration: 2000
    });
    toast.present();
  }

}
