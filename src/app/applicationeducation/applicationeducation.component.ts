import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { UserService, ApplicationService } from '../services';

@Component({
  selector: 'app-applicationeducation',
  templateUrl: './applicationeducation.component.html',
  styleUrls: ['./applicationeducation.component.scss'],
})
export class ApplicationeducationComponent implements OnInit {
  
  user_type: string;
  show_hsc: boolean = false;
  show_gradutn: boolean = false;
  show_pg: boolean = false;
  year_list:any = [];
  
  student_id: string = null;

  id_ssc: string = null;
  from_ssc: string = null;
  to_ssc: string = null;
  institue_ssc: string = "";
  board_ssc: string = "";
  pass_year_ssc: string = null;
  marks_ssc: string = "";
  rank_ssc: number = null;
  subject_ssc: string = "";

  id_hsc: string = null;
  from_hsc: string = null;
  to_hsc: string = null;
  institue_hsc: string = "";
  board_hsc: string = "";
  pass_year_hsc: string = null;
  marks_hsc: string = "";
  rank_hsc: number = null;
  subject_hsc: string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public applicationService: ApplicationService,
    public userService: UserService
  ) { }

  yearList() {
    let this_year = (new Date()).getFullYear();
    for(let year = this_year; year >= 1971; year--) {
      this.year_list.push(year);
    }
  }

  ngOnInit() {
    this.yearList();
  }

  ionViewWillEnter() { 
    if(this.userService.currentUserValue == null) {
      this.router.navigate(['/login']);
    } else {
      console.log('Location: ApplicationeducationComponent');

      this.user_type = this.userService.currentUserValue.user_type;

      this.student_id = this.route.snapshot.paramMap.get('id');

      this.education_details();
    }
  }

  async education_details() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.applicationService.education_detail(this.student_id).subscribe(async response => {
      console.log('Education details: ', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        response.data.forEach(element => {
          if(element.degree == 'ssc') {
            this.id_ssc = element.id;
            this.institue_ssc = element.institute;
            this.board_ssc = element.board;
            this.pass_year_ssc = element.year_passing;
            this.marks_ssc = element.marks;
            this.rank_ssc = element.class_rank;
            this.subject_ssc = element.major_subject;
            this.from_ssc = element.period_from;
            this.to_ssc = element.period_to;
            
            this.show_hsc = true;
          } else if(element.degree == 'hsc') {
            this.id_hsc = element.id;
            this.institue_hsc = element.institute;
            this.board_hsc = element.board;
            this.pass_year_hsc = element.year_passing;
            this.marks_hsc = element.marks;
            this.rank_hsc = element.class_rank;
            this.subject_hsc = element.major_subject;
            this.from_hsc = element.period_from;
            this.to_hsc = element.period_to;
            
            this.show_gradutn = true;
          }
        });
      } else {
        //--- If no education details available then disable hsc, graduation and pg
        this.show_hsc = false;
        this.show_gradutn = false;
        this.show_pg = false;
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to load student education!",
        buttons: ['OK']
      });
      alert.present();
    });
  }

  async onSubmit_ssc() {
    if(this.from_ssc != null){
      let date_split = this.from_ssc.split('T');
      this.from_ssc = date_split[0];
    }
    
    if(this.to_ssc != null){
      let date_split = this.to_ssc.split('T');
      this.to_ssc = date_split[0];
    }

    //--- Check empty and invalid credentials
    if(this.from_ssc == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.to_ssc == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select to date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.institue_ssc.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter School/College/Institute name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.board_ssc.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Board/University name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.pass_year_ssc == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select year of passing!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.marks_ssc.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Division/%Marks of CGPa!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_ssc == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter class rank!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_ssc < 1) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid rank!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.subject_ssc.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Special/Major Subject!",
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
        student_id: this.student_id,
        degree: 'ssc',
        degree_year: '',
        institute: this.institue_ssc,
        board: this.board_ssc,
        year_passing: this.pass_year_ssc,
        marks: this.marks_ssc,
        class_rank: this.rank_ssc,
        major_subject: this.subject_ssc,
        period_from: this.from_ssc,
        period_to: this.to_ssc
      }
      //console.log('Application personal sendData: ', sendData);

      this.applicationService.educatuion_insert(sendData).subscribe(async response => {
        //console.log('educatuion_ssc_insert response: ', response);
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

          this.id_ssc = response.inserted_id;
          this.show_hsc = true;
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: response.message,
            buttons: ['OK']
          });
          alert.present();
        }
      }, async error => {
        console.log('educatuion_ssc_insert error: ', error);
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

  async onUpdate_ssc() {
    if(this.from_ssc != null){
      let date_split = this.from_ssc.split('T');
      this.from_ssc = date_split[0];
    }
    
    if(this.to_ssc != null){
      let date_split = this.to_ssc.split('T');
      this.to_ssc = date_split[0];
    }

    //--- Check empty and invalid credentials
    if(this.id_ssc == null || this.student_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to update!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.from_ssc == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.to_ssc == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select to date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.institue_ssc.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter School/College/Institute name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.board_ssc.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Board/University name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.pass_year_ssc == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select year of passing!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.marks_ssc.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Division/%Marks of CGPa!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_ssc == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter class rank!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_ssc < 1) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid rank!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.subject_ssc.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Special/Major Subject!",
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
        id: this.id_ssc,
        student_id: this.student_id,
        degree: 'ssc',
        degree_year: '',
        institute: this.institue_ssc,
        board: this.board_ssc,
        year_passing: this.pass_year_ssc,
        marks: this.marks_ssc,
        class_rank: this.rank_ssc,
        major_subject: this.subject_ssc,
        period_from: this.from_ssc,
        period_to: this.to_ssc
      }
      //console.log('Application personal sendData: ', sendData);

      this.applicationService.educatuion_update(sendData).subscribe(async response => {
        console.log('educatuion_ssc_update response: ', response);
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
        console.log('educatuion_ssc_update error: ', error);
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

  async onSubmit_hsc() {
    if(this.from_hsc != null){
      let date_split = this.from_hsc.split('T');
      this.from_hsc = date_split[0];
    }
    
    if(this.to_hsc != null){
      let date_split = this.to_hsc.split('T');
      this.to_hsc = date_split[0];
    }

    //--- Check empty and invalid credentials
    if(this.from_hsc == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.to_hsc == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select to date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.institue_hsc.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter School/College/Institute name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.board_hsc.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Board/University name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.pass_year_hsc == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select year of passing!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.marks_hsc.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Division/%Marks of CGPa!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_hsc == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter class rank!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_hsc < 1) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid rank!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.subject_hsc.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Special/Major Subject!",
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
        student_id: this.student_id,
        degree: 'hsc',
        degree_year: '',
        institute: this.institue_hsc,
        board: this.board_hsc,
        year_passing: this.pass_year_hsc,
        marks: this.marks_hsc,
        class_rank: this.rank_hsc,
        major_subject: this.subject_hsc,
        period_from: this.from_hsc,
        period_to: this.to_hsc
      }
      //console.log('Application personal sendData: ', sendData);

      this.applicationService.educatuion_insert(sendData).subscribe(async response => {
        //console.log('educatuion_ssc_insert response: ', response);
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

          this.id_hsc = response.inserted_id;
          this.show_gradutn = true;
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: response.message,
            buttons: ['OK']
          });
          alert.present();
        }
      }, async error => {
        console.log('educatuion_hsc_insert error: ', error);
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

  async onUpdate_hsc() {
    if(this.from_hsc != null){
      let date_split = this.from_hsc.split('T');
      this.from_hsc = date_split[0];
    }
    
    if(this.to_hsc != null){
      let date_split = this.to_hsc.split('T');
      this.to_hsc = date_split[0];
    }

    //--- Check empty and invalid credentials
    if(this.id_hsc == null || this.student_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to update!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.from_hsc == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.to_hsc == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select to date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.institue_hsc.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter School/College/Institute name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.board_hsc.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Board/University name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.pass_year_hsc == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select year of passing!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.marks_hsc.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Division/%Marks of CGPa!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_hsc == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter class rank!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_hsc < 1) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid rank!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.subject_hsc.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Special/Major Subject!",
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
        id: this.id_hsc,
        student_id: this.student_id,
        degree: 'hsc',
        degree_year: '',
        institute: this.institue_hsc,
        board: this.board_hsc,
        year_passing: this.pass_year_hsc,
        marks: this.marks_hsc,
        class_rank: this.rank_hsc,
        major_subject: this.subject_hsc,
        period_from: this.from_hsc,
        period_to: this.to_hsc
      }
      //console.log('Application education update sendData: ', sendData);

      this.applicationService.educatuion_update(sendData).subscribe(async response => {
        //console.log('educatuion_hsc_update response: ', response);
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
        console.log('educatuion_hsc_update error: ', error);
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
    this.router.navigate(['/application-personal', {type: 'edit', id: this.student_id}]);
  }

  moveNext() {
    this.router.navigate(['/application-activity']);
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
