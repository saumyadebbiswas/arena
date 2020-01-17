import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { UserService, ApplicationService } from '../services';

@Component({
  selector: 'app-applicationactivities',
  templateUrl: './applicationactivities.component.html',
  styleUrls: ['./applicationactivities.component.scss'],
})
export class ApplicationactivitiesComponent implements OnInit {

  user_type: string;
  show_next_button: boolean = false;
  check_eng: boolean = false;
  check_hin: boolean = false;
  check_beng: boolean = false;
  check_oth: boolean = false;
  
  student_id: string = null;
  student_type: string = "1";
  id: string = null;
  games: string = "";
  social_activity: string = "";
  hobbies: string = "";
  languages: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public applicationService: ApplicationService,
    public userService: UserService
  ) { }

  ngOnInit() {}

  ionViewWillEnter() { 
    if(this.userService.currentUserValue == null) {
      this.router.navigate(['/login']);
    } else {
      console.log('Location: ApplicationactivitiesComponent');

      this.user_type = this.userService.currentUserValue.user_type;

      this.student_id = this.route.snapshot.paramMap.get('id');
      this.student_type = localStorage.getItem("student_type");

      this.activity_details();
    }
  }

  async activity_details() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.applicationService.activity_detail(this.student_id).subscribe(async response => {
      //console.log('Education details: ', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.id = response.data[0].id;
        if(response.data[0].games != null) {
          this.games = response.data[0].games;
        }
        if(response.data[0].social_activity != null) {
          this.social_activity = response.data[0].social_activity;
        }
        if(response.data[0].hobbies != null) {
          this.hobbies = response.data[0].hobbies;
        }
        this.setLanguages(response.data[0].languages);
        this.show_next_button = true;
      } else {
        const toast = await this.toastController.create({
          message: response.message,
          color: "dark",
          position: "bottom",
          duration: 2000
        });
        toast.present();

        this.show_next_button = false;
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
    if(this.languages.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Choose a language!",
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

      let languages = this.languages.join(',');

      let sendData = {
        student_id: this.student_id,
        games: this.games,
        social_activity: this.social_activity,
        hobbies: this.hobbies,
        languages: languages
      }
      //console.log('Application activity insert sendData: ', sendData);

      this.applicationService.activities_insert(sendData).subscribe(async response => {
        //console.log('Application activity insert response: ', response);
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

          this.id = response.inserted_id;
          this.show_next_button = true;
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: response.message,
            buttons: ['OK']
          });
          alert.present();
        }
      }, async error => {
        console.log('Activities error: ', error);
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
    if(this.id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to update!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.languages.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Choose a language!",
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

      let languages = this.languages.join(',');

      let sendData = {
        id: this.id,
        student_id: this.student_id,
        games: this.games,
        social_activity: this.social_activity,
        hobbies: this.hobbies,
        languages: languages
      }
      //console.log('Application activity update sendData: ', sendData);

      this.applicationService.activities_update(sendData).subscribe(async response => {
        //console.log('activity update response: ', response);
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
        console.log('Activities update error: ', error);
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
  
  chooselanguage(event, lang) {
    var isChecked = event.currentTarget.checked;
    //console.log('language event: ', isChecked, lang);
    
    if(isChecked) {
      this.languages.push(lang);
    } else {
      var start_index = this.languages.indexOf(lang);
      this.languages.splice(start_index, 1); //--- 1 item will be removed
    }
    //console.log('language array: ', this.languages);
  }

  setLanguages(languages) {
    let languages_arr = languages.split(',');
    //console.log('languages_arr', languages_arr);
    languages_arr.forEach(element => {
      this.languages.push(element);
      if(element == 'eng') {
        this.check_eng = true;
      } else if(element == 'hin') {
        this.check_hin = true;
      } else if(element == 'beng') {
        this.check_beng = true;
      } else if(element == 'oth') {
        this.check_oth = true;
      }
    });
    //console.log('this.languages: ', this.languages);
  }

  movePrevious() {
    this.router.navigate(['/application-education', {id: this.student_id}]);
  }

  moveNext() {
    if(this.user_type == 'admin') {
      this.router.navigate(['/application-official', {id: this.student_id}]);
    } else if(this.user_type == 'student') {
      this.router.navigate(['/application-finish']);
    }
  }

}
