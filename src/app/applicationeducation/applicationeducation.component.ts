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
  show_grad2ndyr: boolean = false;
  show_grad3rdyr: boolean = false;
  show_grad4thyr: boolean = false;
  show_pg2yr: boolean = false;
  year_list:any = [];
  ssc_class_active: boolean = true;
  grad1st_class_active: boolean = true;
  pg1st_class_active: boolean = true;
  
  student_id: string = null;
  student_type: string = "1";

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

  grad_type: string = 'ba';

  id_grad1st: string = null;
  from_grad1st: string = null;
  to_grad1st: string = null;
  institue_grad1st: string = "";
  board_grad1st: string = "";
  pass_year_grad1st: string = null;
  marks_grad1st: string = "";
  rank_grad1st: number = null;
  subject_grad1st: string = "";

  id_grad2: string = null;
  from_grad2: string = null;
  to_grad2: string = null;
  institue_grad2: string = "";
  board_grad2: string = "";
  pass_year_grad2: string = null;
  marks_grad2: string = "";
  rank_grad2: number = null;
  subject_grad2: string = "";

  id_grad3: string = null;
  from_grad3: string = null;
  to_grad3: string = null;
  institue_grad3: string = "";
  board_grad3: string = "";
  pass_year_grad3: string = null;
  marks_grad3: string = "";
  rank_grad3: number = null;
  subject_grad3: string = "";

  id_grad4: string = null;
  from_grad4: string = null;
  to_grad4: string = null;
  institue_grad4: string = "";
  board_grad4: string = "";
  pass_year_grad4: string = null;
  marks_grad4: string = "";
  rank_grad4: number = null;
  subject_grad4: string = "";

  id_pg1: string = null;
  from_pg1: string = null;
  to_pg1: string = null;
  institue_pg1: string = "";
  board_pg1: string = "";
  pass_year_pg1: string = null;
  marks_pg1: string = "";
  rank_pg1: number = null;
  subject_pg1: string = "";

  id_pg2: string = null;
  from_pg2: string = null;
  to_pg2: string = null;
  institue_pg2: string = "";
  board_pg2: string = "";
  pass_year_pg2: string = null;
  marks_pg2: string = "";
  rank_pg2: number = null;
  subject_pg2: string = "";

  id_ext: string = null;
  from_ext: string = null;
  to_ext: string = null;
  institue_ext: string = "";
  board_ext: string = "";
  pass_year_ext: string = null;
  marks_ext: string = "";
  rank_ext: number = null;
  subject_ext: string = "";

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
      this.student_type = localStorage.getItem("student_type");

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
      //console.log('Education details: ', response);
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
          } else if((element.degree == 'ba' || element.degree == 'bsc' || element.degree == 'bcom' || element.degree == 'others') && element.degree_year == '1') {
            this.grad_type = element.degree;
            this.id_grad1st = element.id;
            this.institue_grad1st = element.institute;
            this.board_grad1st = element.board;
            this.pass_year_grad1st = element.year_passing;
            this.marks_grad1st = element.marks;
            this.rank_grad1st = element.class_rank;
            this.subject_grad1st = element.major_subject;
            this.from_grad1st = element.period_from;
            this.to_grad1st = element.period_to;
            
            this.show_grad2ndyr = true;

            this.institue_grad2 = this.institue_grad1st;
            this.board_grad2 = this.board_grad1st;
            this.subject_grad2 = this.subject_grad1st;
          } else if((element.degree == 'ba' || element.degree == 'bsc' || element.degree == 'bcom' || element.degree == 'others') && element.degree_year == '2') {
            this.id_grad2 = element.id;
            this.institue_grad2 = element.institute;
            this.board_grad2 = element.board;
            this.pass_year_grad2 = element.year_passing;
            this.marks_grad2 = element.marks;
            this.rank_grad2 = element.class_rank;
            this.subject_grad2 = element.major_subject;
            this.from_grad2 = element.period_from;
            this.to_grad2 = element.period_to;
            
            this.show_grad3rdyr = true;

            this.institue_grad3 = this.institue_grad1st;
            this.board_grad3 = this.board_grad1st;
            this.subject_grad3 = this.subject_grad1st;
          } else if((element.degree == 'ba' || element.degree == 'bsc' || element.degree == 'bcom' || element.degree == 'others') && element.degree_year == '3') {
            this.id_grad3 = element.id;
            this.institue_grad3 = element.institute;
            this.board_grad3 = element.board;
            this.pass_year_grad3 = element.year_passing;
            this.marks_grad3 = element.marks;
            this.rank_grad3 = element.class_rank;
            this.subject_grad3 = element.major_subject;
            this.from_grad3 = element.period_from;
            this.to_grad3 = element.period_to;
            
            this.show_grad4thyr = true;
            this.show_pg = true;

            this.institue_grad4 = this.institue_grad1st;
            this.board_grad4 = this.board_grad1st;
            this.subject_grad4 = this.subject_grad1st;
          } else if((element.degree == 'ba' || element.degree == 'bsc' || element.degree == 'bcom' || element.degree == 'others') && element.degree_year == '4') {
            this.id_grad4 = element.id;
            this.institue_grad4 = element.institute;
            this.board_grad4 = element.board;
            this.pass_year_grad4 = element.year_passing;
            this.marks_grad4 = element.marks;
            this.rank_grad4 = element.class_rank;
            this.subject_grad4 = element.major_subject;
            this.from_grad4 = element.period_from;
            this.to_grad4 = element.period_to;
          } else if(element.degree == 'pg' && element.degree_year == '1') {
            this.id_pg1 = element.id;
            this.institue_pg1 = element.institute;
            this.board_pg1 = element.board;
            this.pass_year_pg1 = element.year_passing;
            this.marks_pg1 = element.marks;
            this.rank_pg1 = element.class_rank;
            this.subject_pg1 = element.major_subject;
            this.from_pg1 = element.period_from;
            this.to_pg1 = element.period_to;
            
            this.show_pg2yr = true;

            this.institue_grad2 = this.institue_grad1st;
            this.board_grad2 = this.board_grad1st;
            this.subject_grad2 = this.subject_grad1st;
          } else if(element.degree == 'pg' && element.degree_year == '2') {
            this.id_pg2 = element.id;
            this.institue_pg2 = element.institute;
            this.board_pg2 = element.board;
            this.pass_year_pg2 = element.year_passing;
            this.marks_pg2 = element.marks;
            this.rank_pg2 = element.class_rank;
            this.subject_pg2 = element.major_subject;
            this.from_pg2 = element.period_from;
            this.to_pg2 = element.period_to;
          } else if(element.degree == 'extra') {
            this.id_ext = element.id;
            this.institue_ext = element.institute;
            this.board_ext = element.board;
            this.pass_year_ext = element.year_passing;
            this.marks_ext = element.marks;
            this.rank_ext = element.class_rank;
            this.subject_ext = element.major_subject;
            this.from_ext = element.period_from;
            this.to_ext = element.period_to;
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

  async onSubmit_grad1st() {
    if(this.from_grad1st != null){
      let date_split = this.from_grad1st.split('T');
      this.from_grad1st = date_split[0];
    }
    
    if(this.to_grad1st != null){
      let date_split = this.to_grad1st.split('T');
      this.to_grad1st = date_split[0];
    }

    //--- Check empty and invalid credentials
    if(this.grad_type == null || this.grad_type == "") {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Choose graduation type!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.from_grad1st == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.to_grad1st == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select to date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.institue_grad1st.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter School/College/Institute name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.board_grad1st.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Board/University name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.pass_year_grad1st == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select year of passing!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.marks_grad1st.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Division/%Marks of CGPa!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_grad1st == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter class rank!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_grad1st < 1) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid rank!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.subject_grad1st.length == 0) {
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
        degree: this.grad_type,
        degree_year: '1',
        institute: this.institue_grad1st,
        board: this.board_grad1st,
        year_passing: this.pass_year_grad1st,
        marks: this.marks_grad1st,
        class_rank: this.rank_grad1st,
        major_subject: this.subject_grad1st,
        period_from: this.from_grad1st,
        period_to: this.to_grad1st
      }
      //console.log('Application personal sendData: ', sendData);

      this.applicationService.educatuion_insert(sendData).subscribe(async response => {
        //console.log('educatuion_grad_1st_year_insert response: ', response);
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

          this.id_grad1st = response.inserted_id;
          this.show_grad2ndyr = true;

          this.institue_grad2 = this.institue_grad1st;
          this.board_grad2 = this.board_grad1st;
          this.subject_grad2 = this.subject_grad1st;
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: response.message,
            buttons: ['OK']
          });
          alert.present();
        }
      }, async error => {
        console.log('educatuion_grad_1st_year_insert error: ', error);
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

  async onUpdate_grad1st() {
    if(this.from_grad1st != null){
      let date_split = this.from_grad1st.split('T');
      this.from_grad1st = date_split[0];
    }
    
    if(this.to_grad1st != null){
      let date_split = this.to_grad1st.split('T');
      this.to_grad1st = date_split[0];
    }

    //--- Check empty and invalid credentials
    if(this.id_grad1st == null || this.student_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to update!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.grad_type == null || this.grad_type == "") {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Choose graduation type!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.from_grad1st == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.to_grad1st == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select to date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.institue_grad1st.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter School/College/Institute name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.board_grad1st.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Board/University name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.pass_year_grad1st == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select year of passing!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.marks_grad1st.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Division/%Marks of CGPa!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_grad1st == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter class rank!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_grad1st < 1) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid rank!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.subject_grad1st.length == 0) {
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
        id: this.id_grad1st,
        student_id: this.student_id,
        degree: this.grad_type,
        degree_year: '1',
        institute: this.institue_grad1st,
        board: this.board_grad1st,
        year_passing: this.pass_year_grad1st,
        marks: this.marks_grad1st,
        class_rank: this.rank_grad1st,
        major_subject: this.subject_grad1st,
        period_from: this.from_grad1st,
        period_to: this.to_grad1st
      }
      //console.log('educatuion_grad_1st_year_update sendData: ', sendData);

      this.applicationService.educatuion_update(sendData).subscribe(async response => {
        //console.log('educatuion_grad_1st_year_update response: ', response);
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
        console.log('educatuion_grad_1st_year_update error: ', error);
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

  async onSubmit_grad2() {
    if(this.from_grad2 != null){
      let date_split = this.from_grad2.split('T');
      this.from_grad2 = date_split[0];
    }
    
    if(this.to_grad2 != null){
      let date_split = this.to_grad2.split('T');
      this.to_grad2 = date_split[0];
    }

    //--- Check empty and invalid credentials
    if(this.grad_type == null || this.grad_type == "") {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Choose graduation type!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.from_grad2 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.to_grad2 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select to date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.institue_grad2.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter School/College/Institute name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.board_grad2.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Board/University name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.pass_year_grad2 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select year of passing!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.marks_grad2.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Division/%Marks of CGPa!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_grad2 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter class rank!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_grad2 < 1) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid rank!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.subject_grad2.length == 0) {
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
        degree: this.grad_type,
        degree_year: '2',
        institute: this.institue_grad2,
        board: this.board_grad2,
        year_passing: this.pass_year_grad2,
        marks: this.marks_grad2,
        class_rank: this.rank_grad2,
        major_subject: this.subject_grad2,
        period_from: this.from_grad2,
        period_to: this.to_grad2
      }
      //console.log('educatuion_grad_2nd_year_insert sendData: ', sendData);

      this.applicationService.educatuion_insert(sendData).subscribe(async response => {
        //console.log('educatuion_grad_2nd_year_insert response: ', response);
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

          this.id_grad2 = response.inserted_id;
          this.show_grad3rdyr = true;

          this.institue_grad3 = this.institue_grad1st;
          this.board_grad3 = this.board_grad1st;
          this.subject_grad3 = this.subject_grad1st;
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: response.message,
            buttons: ['OK']
          });
          alert.present();
        }
      }, async error => {
        console.log('educatuion_grad_2nd_year_insert error: ', error);
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

  async onUpdate_grad2() {
    if(this.from_grad2 != null){
      let date_split = this.from_grad2.split('T');
      this.from_grad2 = date_split[0];
    }
    
    if(this.to_grad2 != null){
      let date_split = this.to_grad2.split('T');
      this.to_grad2 = date_split[0];
    }

    //--- Check empty and invalid credentials
    if(this.id_grad2 == null || this.student_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to update!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.grad_type == null || this.grad_type == "") {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Choose graduation type!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.from_grad2 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.to_grad2 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select to date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.institue_grad2.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter School/College/Institute name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.board_grad2.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Board/University name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.pass_year_grad2 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select year of passing!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.marks_grad2.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Division/%Marks of CGPa!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_grad2 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter class rank!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_grad2 < 1) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid rank!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.subject_grad2.length == 0) {
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
        id: this.id_grad2,
        student_id: this.student_id,
        degree: this.grad_type,
        degree_year: '2',
        institute: this.institue_grad2,
        board: this.board_grad2,
        year_passing: this.pass_year_grad2,
        marks: this.marks_grad2,
        class_rank: this.rank_grad2,
        major_subject: this.subject_grad2,
        period_from: this.from_grad2,
        period_to: this.to_grad2
      }
      //console.log('educatuion_grad_2nd_year_update sendData: ', sendData);

      this.applicationService.educatuion_update(sendData).subscribe(async response => {
        //console.log('educatuion_grad_2nd_year_update response: ', response);
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
        console.log('educatuion_grad_2nd_year_update error: ', error);
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

  async onSubmit_grad3() {
    if(this.from_grad3 != null){
      let date_split = this.from_grad3.split('T');
      this.from_grad3 = date_split[0];
    }
    
    if(this.to_grad3 != null){
      let date_split = this.to_grad3.split('T');
      this.to_grad3 = date_split[0];
    }

    //--- Check empty and invalid credentials
    if(this.grad_type == null || this.grad_type == "") {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Choose graduation type!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.from_grad3 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.to_grad3 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select to date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.institue_grad3.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter School/College/Institute name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.board_grad3.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Board/University name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.pass_year_grad3 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select year of passing!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.marks_grad3.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Division/%Marks of CGPa!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_grad3 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter class rank!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_grad3 < 1) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid rank!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.subject_grad3.length == 0) {
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
        degree: this.grad_type,
        degree_year: '3',
        institute: this.institue_grad3,
        board: this.board_grad3,
        year_passing: this.pass_year_grad3,
        marks: this.marks_grad3,
        class_rank: this.rank_grad3,
        major_subject: this.subject_grad3,
        period_from: this.from_grad3,
        period_to: this.to_grad3
      }
      //console.log('educatuion_grad_3rd_year_insert sendData: ', sendData);

      this.applicationService.educatuion_insert(sendData).subscribe(async response => {
        //console.log('educatuion_grad_3rd_year_insert response: ', response);
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

          this.id_grad3 = response.inserted_id;
          this.show_grad4thyr = true;
          this.show_pg = true;

          this.institue_grad4 = this.institue_grad1st;
          this.board_grad4 = this.board_grad1st;
          this.subject_grad4 = this.subject_grad1st;
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: response.message,
            buttons: ['OK']
          });
          alert.present();
        }
      }, async error => {
        console.log('educatuion_grad_3rd_year_insert error: ', error);
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

  async onUpdate_grad3() {
    if(this.from_grad3 != null){
      let date_split = this.from_grad3.split('T');
      this.from_grad3 = date_split[0];
    }
    
    if(this.to_grad3 != null){
      let date_split = this.to_grad3.split('T');
      this.to_grad3 = date_split[0];
    }

    //--- Check empty and invalid credentials
    if(this.id_grad3 == null || this.student_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to update!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.grad_type == null || this.grad_type == "") {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Choose graduation type!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.from_grad3 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.to_grad3 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select to date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.institue_grad3.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter School/College/Institute name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.board_grad3.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Board/University name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.pass_year_grad3 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select year of passing!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.marks_grad3.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Division/%Marks of CGPa!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_grad3 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter class rank!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_grad3 < 1) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid rank!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.subject_grad3.length == 0) {
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
        id: this.id_grad3,
        student_id: this.student_id,
        degree: this.grad_type,
        degree_year: '3',
        institute: this.institue_grad3,
        board: this.board_grad3,
        year_passing: this.pass_year_grad3,
        marks: this.marks_grad3,
        class_rank: this.rank_grad3,
        major_subject: this.subject_grad3,
        period_from: this.from_grad3,
        period_to: this.to_grad3
      }
      //console.log('educatuion_grad_3rd_year_update sendData: ', sendData);

      this.applicationService.educatuion_update(sendData).subscribe(async response => {
        //console.log('educatuion_grad_3rd_year_update response: ', response);
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
        console.log('educatuion_grad_3rd_year_update error: ', error);
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

  async onSubmit_grad4() {
    if(this.from_grad4 != null){
      let date_split = this.from_grad4.split('T');
      this.from_grad4 = date_split[0];
    }
    
    if(this.to_grad4 != null){
      let date_split = this.to_grad4.split('T');
      this.to_grad4 = date_split[0];
    }

    //--- Check empty and invalid credentials
    if(this.grad_type == null || this.grad_type == "") {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Choose graduation type!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.from_grad4 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.to_grad4 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select to date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.institue_grad4.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter School/College/Institute name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.board_grad4.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Board/University name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.pass_year_grad4 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select year of passing!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.marks_grad4.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Division/%Marks of CGPa!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_grad4 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter class rank!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_grad4 < 1) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid rank!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.subject_grad4.length == 0) {
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
        degree: this.grad_type,
        degree_year: '4',
        institute: this.institue_grad4,
        board: this.board_grad4,
        year_passing: this.pass_year_grad4,
        marks: this.marks_grad4,
        class_rank: this.rank_grad4,
        major_subject: this.subject_grad4,
        period_from: this.from_grad4,
        period_to: this.to_grad4
      }
      //console.log('educatuion_grad_4th_year_insert sendData: ', sendData);

      this.applicationService.educatuion_insert(sendData).subscribe(async response => {
        //console.log('educatuion_grad_4th_year_insert response: ', response);
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

          this.id_grad4 = response.inserted_id;
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: response.message,
            buttons: ['OK']
          });
          alert.present();
        }
      }, async error => {
        console.log('educatuion_grad_4th_year_insert error: ', error);
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

  async onUpdate_grad4() {
    if(this.from_grad4 != null){
      let date_split = this.from_grad4.split('T');
      this.from_grad4 = date_split[0];
    }
    
    if(this.to_grad4 != null){
      let date_split = this.to_grad4.split('T');
      this.to_grad4 = date_split[0];
    }

    //--- Check empty and invalid credentials
    if(this.id_grad4 == null || this.student_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to update!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.grad_type == null || this.grad_type == "") {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Choose graduation type!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.from_grad4 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.to_grad4 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select to date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.institue_grad4.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter School/College/Institute name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.board_grad4.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Board/University name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.pass_year_grad4 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select year of passing!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.marks_grad4.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Division/%Marks of CGPa!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_grad4 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter class rank!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_grad4 < 1) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid rank!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.subject_grad4.length == 0) {
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
        id: this.id_grad4,
        student_id: this.student_id,
        degree: this.grad_type,
        degree_year: '4',
        institute: this.institue_grad4,
        board: this.board_grad4,
        year_passing: this.pass_year_grad4,
        marks: this.marks_grad4,
        class_rank: this.rank_grad4,
        major_subject: this.subject_grad4,
        period_from: this.from_grad4,
        period_to: this.to_grad4
      }
      //console.log('educatuion_grad_4th_year_update sendData: ', sendData);

      this.applicationService.educatuion_update(sendData).subscribe(async response => {
        //console.log('educatuion_grad_4th_year_update response: ', response);
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
        console.log('educatuion_grad_4th_year_update error: ', error);
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

  async onSubmit_pg1() {
    if(this.from_pg1 != null){
      let date_split = this.from_pg1.split('T');
      this.from_pg1 = date_split[0];
    }
    
    if(this.to_pg1 != null){
      let date_split = this.to_pg1.split('T');
      this.to_pg1 = date_split[0];
    }

    //--- Check empty and invalid credentials
    if(this.from_pg1 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.to_pg1 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select to date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.institue_pg1.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter School/College/Institute name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.board_pg1.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Board/University name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.pass_year_pg1 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select year of passing!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.marks_pg1.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Division/%Marks of CGPa!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_pg1 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter class rank!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_pg1 < 1) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid rank!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.subject_pg1.length == 0) {
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
        degree: 'pg',
        degree_year: '1',
        institute: this.institue_pg1,
        board: this.board_pg1,
        year_passing: this.pass_year_pg1,
        marks: this.marks_pg1,
        class_rank: this.rank_pg1,
        major_subject: this.subject_pg1,
        period_from: this.from_pg1,
        period_to: this.to_pg1
      }
      //console.log('educatuion_pg_1st_year_insert: ', sendData);

      this.applicationService.educatuion_insert(sendData).subscribe(async response => {
        //console.log('educatuion_pg_1st_year_insert response: ', response);
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

          this.id_pg1 = response.inserted_id;
          this.show_pg2yr = true;

          this.institue_pg2 = this.institue_pg1;
          this.board_pg2 = this.board_pg1;
          this.subject_pg2 = this.subject_pg1;
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: response.message,
            buttons: ['OK']
          });
          alert.present();
        }
      }, async error => {
        console.log('educatuion_pg_1st_year_insert error: ', error);
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

  async onUpdate_pg1() {
    if(this.from_pg1 != null){
      let date_split = this.from_pg1.split('T');
      this.from_pg1 = date_split[0];
    }
    
    if(this.to_pg1 != null){
      let date_split = this.to_pg1.split('T');
      this.to_pg1 = date_split[0];
    }

    //--- Check empty and invalid credentials
    if(this.id_pg1 == null || this.student_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to update!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.from_pg1 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.to_pg1 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select to date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.institue_pg1.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter School/College/Institute name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.board_pg1.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Board/University name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.pass_year_pg1 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select year of passing!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.marks_pg1.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Division/%Marks of CGPa!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_pg1 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter class rank!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_pg1 < 1) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid rank!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.subject_pg1.length == 0) {
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
        id: this.id_pg1,
        student_id: this.student_id,
        degree: 'pg',
        degree_year: '1',
        institute: this.institue_pg1,
        board: this.board_pg1,
        year_passing: this.pass_year_pg1,
        marks: this.marks_pg1,
        class_rank: this.rank_pg1,
        major_subject: this.subject_pg1,
        period_from: this.from_pg1,
        period_to: this.to_pg1
      }
      //console.log('educatuion_pg_1st_year_update sendData: ', sendData);

      this.applicationService.educatuion_update(sendData).subscribe(async response => {
        //console.log('educatuion_pg_1st_year_update response: ', response);
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
        console.log('educatuion_pg_1st_year_update error: ', error);
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

  async onSubmit_pg2() {
    if(this.from_pg2 != null){
      let date_split = this.from_pg2.split('T');
      this.from_pg2 = date_split[0];
    }
    
    if(this.to_pg2 != null){
      let date_split = this.to_pg2.split('T');
      this.to_pg2 = date_split[0];
    }

    //--- Check empty and invalid credentials
    if(this.from_pg2 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.to_pg2 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select to date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.institue_pg2.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter School/College/Institute name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.board_pg2.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Board/University name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.pass_year_pg2 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select year of passing!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.marks_pg2.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Division/%Marks of CGPa!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_pg2 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter class rank!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_pg2 < 1) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid rank!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.subject_pg2.length == 0) {
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
        degree: 'pg',
        degree_year: '2',
        institute: this.institue_pg2,
        board: this.board_pg2,
        year_passing: this.pass_year_pg2,
        marks: this.marks_pg2,
        class_rank: this.rank_pg2,
        major_subject: this.subject_pg2,
        period_from: this.from_pg2,
        period_to: this.to_pg2
      }
      //console.log('educatuion_pg_2nd_year_insert: ', sendData);

      this.applicationService.educatuion_insert(sendData).subscribe(async response => {
        //console.log('educatuion_pg_2nd_year_insert response: ', response);
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

          this.id_pg2 = response.inserted_id;
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: response.message,
            buttons: ['OK']
          });
          alert.present();
        }
      }, async error => {
        console.log('educatuion_pg_2nd_year_insert error: ', error);
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

  async onUpdate_pg2() {
    if(this.from_pg2 != null){
      let date_split = this.from_pg2.split('T');
      this.from_pg2 = date_split[0];
    }
    
    if(this.to_pg2 != null){
      let date_split = this.to_pg2.split('T');
      this.to_pg2 = date_split[0];
    }

    //--- Check empty and invalid credentials
    if(this.id_pg2 == null || this.student_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to update!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.from_pg2 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.to_pg2 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select to date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.institue_pg2.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter School/College/Institute name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.board_pg2.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Board/University name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.pass_year_pg2 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select year of passing!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.marks_pg2.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Division/%Marks of CGPa!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_pg2 == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter class rank!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_pg2 < 1) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid rank!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.subject_pg2.length == 0) {
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
        id: this.id_pg2,
        student_id: this.student_id,
        degree: 'pg',
        degree_year: '2',
        institute: this.institue_pg2,
        board: this.board_pg2,
        year_passing: this.pass_year_pg2,
        marks: this.marks_pg2,
        class_rank: this.rank_pg2,
        major_subject: this.subject_pg2,
        period_from: this.from_pg2,
        period_to: this.to_pg2
      }
      //console.log('educatuion_pg_2nd_year_update sendData: ', sendData);

      this.applicationService.educatuion_update(sendData).subscribe(async response => {
        //console.log('educatuion_pg_2nd_year_update response: ', response);
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
        console.log('educatuion_pg_2nd_year_update error: ', error);
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

  async onSubmit_ext() {
    if(this.from_ext != null){
      let date_split = this.from_ext.split('T');
      this.from_ext = date_split[0];
    }
    
    if(this.to_ext != null){
      let date_split = this.to_ext.split('T');
      this.to_ext = date_split[0];
    }

    //--- Check empty and invalid credentials
    if(this.from_ext == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.to_ext == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select to date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.institue_ext.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter School/College/Institute name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.board_ext.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Board/University name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.pass_year_ext == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select year of passing!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.marks_ext.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Division/%Marks of CGPa!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_ext == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter class rank!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_ext < 1) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid rank!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.subject_ext.length == 0) {
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
        degree: 'extra',
        degree_year: '',
        institute: this.institue_ext,
        board: this.board_ext,
        year_passing: this.pass_year_ext,
        marks: this.marks_ext,
        class_rank: this.rank_ext,
        major_subject: this.subject_ext,
        period_from: this.from_ext,
        period_to: this.to_ext
      }
      //console.log('educatuion_extra_insert sendData: ', sendData);

      this.applicationService.educatuion_insert(sendData).subscribe(async response => {
        //console.log('educatuion_extra_insert response: ', response);
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

          this.id_ext = response.inserted_id;
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: response.message,
            buttons: ['OK']
          });
          alert.present();
        }
      }, async error => {
        console.log('educatuion_extra_insert error: ', error);
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

  async onUpdate_ext() {
    if(this.from_ext != null){
      let date_split = this.from_ext.split('T');
      this.from_ext = date_split[0];
    }
    
    if(this.to_ext != null){
      let date_split = this.to_ext.split('T');
      this.to_ext = date_split[0];
    }

    //--- Check empty and invalid credentials
    if(this.id_ext == null || this.student_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to update!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.from_ext == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.to_ext == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select to date!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.institue_ext.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter School/College/Institute name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.board_ext.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Board/University name!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.pass_year_ext == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select year of passing!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.marks_ext.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter Division/%Marks of CGPa!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_ext == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter class rank!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.rank_ext < 1) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid rank!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.subject_ext.length == 0) {
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
        id: this.id_ext,
        student_id: this.student_id,
        degree: 'extra',
        degree_year: '',
        institute: this.institue_ext,
        board: this.board_ext,
        year_passing: this.pass_year_ext,
        marks: this.marks_ext,
        class_rank: this.rank_ext,
        major_subject: this.subject_ext,
        period_from: this.from_ext,
        period_to: this.to_ext
      }
      //console.log('educatuion_extra_update sendData: ', sendData);

      this.applicationService.educatuion_update(sendData).subscribe(async response => {
        //console.log('educatuion_extra_update response: ', response);
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
        console.log('educatuion_extra_update error: ', error);
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
  
  async changeGraduation(grad_type) {
    //console.log('grad_type changed: ', grad_type);
    // If any graduation record exist then on change graduation type/stream change the corrosponding graduation years.
    if(this.id_grad1st != null) {
      //--- Start loader
      const loading = await this.loadingController.create({
        message: 'Please wait...',
        spinner: 'bubbles'
      });
      loading.present();

      let sendData = {
        student_id: this.student_id,
        old_degree: this.grad_type,
        new_degree: grad_type
      }
      //console.log('educatuion_extra_update sendData: ', sendData);

      this.applicationService.educatuion_grad_type_update(sendData).subscribe(async response => {
        //console.log('educatuion_extra_update response: ', response);
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
          
          this.grad_type = grad_type;
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: response.message,
            buttons: ['OK']
          });
          alert.present();
        }
      }, async error => {
        console.log('educatuion_extra_update error: ', error);
        //--- In case of login error - dismiss loader, show error message
        this.loadingController.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Error!',
          message: "Internal problem!",
          buttons: ['OK']
        });
        alert.present();
      });
    } else {
      this.grad_type = grad_type;
    }
  }

  removeSSCActive() {
    this.ssc_class_active = false;
  }

  removeGrad1stActive() {
    this.grad1st_class_active = false;
  }

  removePG1stActive() {
    this.pg1st_class_active = false;
  }

  movePrevious() {
    this.router.navigate(['/application-personal', {type: 'edit', id: this.student_id}]);
  }

  moveNext() {
    this.router.navigate(['/application-activity', {id: this.student_id}]);
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
