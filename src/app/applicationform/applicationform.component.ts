import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { UserService, VisitorsService, ApplicationService } from '../services';

@Component({
  selector: 'app-applicationform',
  templateUrl: './applicationform.component.html',
  styleUrls: ['./applicationform.component.scss'],
})
export class ApplicationformComponent implements OnInit {
  
  user_type: string;
  course_list: any = [];
  process_type: string = 'insert';
  show_next_button: boolean = false;
  
  student_id: string = null;
  student_type: string = "1";
  course_id: string = null;
  student_course_id: string = null;
  name: string = "";
  guardian_name: string = "";
  mobile: string = "";
  guardian_mobile: string = "";
  dob: string = null;
  present_addr: string = "";
  check_box: boolean = false;
  permanent_addr: string = "";
  telephone: string = "";
  state: string = "";
  email1: string = "";
  email2: string = "";
  known_from: string = null;
  applied_course_list: any = [];

  show_add_course_btn:boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public alertCtrl: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public applicationService: ApplicationService,
    public visitorsService: VisitorsService,
    public userService: UserService
  ) { }

  ngOnInit() {}

  ionViewWillEnter() { 
    if(this.userService.currentUserValue == null) {
      this.router.navigate(['/login']);
    } else {
      console.log('Location: ApplicationformComponent');

      this.user_type = this.userService.currentUserValue.user_type;
      localStorage.setItem('student_type', this.student_type);
      
      //--- Check parameter type get pass from previous page
      if(this.route.snapshot.paramMap.get('type') == 'insert') {
        this.process_type = 'insert';
        this.student_id = null;
      } else if(this.route.snapshot.paramMap.get('type') == 'edit') {
        this.process_type = 'edit';
        this.student_id = this.route.snapshot.paramMap.get('id');
      } else {
        //--- If no type found then navigate to landing page
        if(this.user_type == 'admin') {
          this.router.navigate(['/reg-students']);
        } else {
          this.router.navigate(['/course']);
        }
      }
      //console.log('Process type ', this.process_type, this.student_id);

      this.course_all();
    }
    
  }

  async course_all() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.visitorsService.course_list().subscribe(async response => {
      //console.log('Course list...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.course_list = response.data;

        if(this.process_type == 'edit') {
          this.student_details();
        }
      } else {
        if(this.process_type == 'edit') {
          this.student_details();
        }
      }
    }, async error => {
      if(this.process_type == 'edit') {
        this.student_details();
      }

      //--- In case of any error - dismiss loader, show error message
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to load courses!",
        buttons: ['OK']
      });
      alert.present();
    });
  }

  //--- Execute when student fill up the form or admin fill up any existing students form
  async student_details() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.applicationService.student_detail(this.student_id).subscribe(async response => {
      //console.log('Student details: ', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.student_id = response.data[0].id;
        this.student_type = response.data[0].type;
        localStorage.setItem('student_type', this.student_type);

        //--- If course details contain a course
        if(response.data.course_details.length > 0) {
          this.applied_course_list = response.data.course_details;
          //console.log('this.applied_course_list: ', this.applied_course_list);
          this.student_course_id = response.data.course_details[0].id;
          this.course_id = response.data.course_details[0].course_id;
        }

        this.name = response.data[0].name;
        if(response.data[0].guardian_name != null) {
          this.guardian_name = response.data[0].guardian_name;
        }
        this.mobile = response.data[0].phone;
        if(response.data[0].guardian_phone != null) {
          this.guardian_mobile = response.data[0].guardian_phone;
        }
        this.dob = response.data[0].dob;
        if(response.data[0].present_address != null) {
          this.present_addr = response.data[0].present_address;
        }
        if(response.data[0].permanent_address != null) {
          this.permanent_addr = response.data[0].permanent_address;
        }
        if(response.data[0].telephone != null) {
          this.telephone = response.data[0].telephone;
        }
        if(response.data[0].state != null) {
          this.state = response.data[0].state;
        }
        if(response.data[0].email != null) {
          this.email1 = response.data[0].email;
        }
        if(response.data[0].email2 != null) {
          this.email2 = response.data[0].email2;
        }
        this.known_from = response.data[0].known_from;

        if(this.student_id != null && this.course_id != null) {
          this.show_next_button = true;
        }
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Error!',
          message: "Unable to load student details!",
          buttons: ['OK']
        });
        alert.present();
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to load student details!",
        buttons: ['OK']
      });
      alert.present();
    });
  }

  checkAddress() {
    if(this.check_box == false) {
      this.check_box = true;
      this.permanent_addr = this.present_addr;
    } else {
      this.check_box = false;
      this.permanent_addr = "";
    }
  }

  async onSubmit() {
    var mail_format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //--- Numeric, min 10 and max 13, fromat: 9876543210

    var phone_num_format = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/; //--- String, format: demo@domain.co

    if(this.dob != null){
      let date_split = this.dob.split('T');
      this.dob = date_split[0];
      //console.log('DOB date......', date_split[0]);
    }

    //--- Check empty and invalid credentials
    if(this.course_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select course!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.name.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter name!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.guardian_name.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter guardian name!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.mobile.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter mobile no!",
        buttons: ['OK']
        });
      alert.present();
    } else if(!phone_num_format.test(this.mobile)) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid mobile number!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.guardian_mobile.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter guardian mobile no!",
        buttons: ['OK']
        });
      alert.present();
    } else if(!phone_num_format.test(this.guardian_mobile)) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid guardian mobile no!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.dob == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select date of birth!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.present_addr.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter present address!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.permanent_addr.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter permanent address!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.telephone.length != 0 && (!phone_num_format.test(this.telephone))) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid telephone no!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.state.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter state!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.email1.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter primary email!",
        buttons: ['OK']
      });
      alert.present();
    } else if(!mail_format.test(this.email1)) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid primary email!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.email2.length != 0 && (!mail_format.test(this.email2))) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid secondary email!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.known_from == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from where you know us!",
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
        applied_course_id: this.course_id,
        name: this.name,
        guardian_name: this.guardian_name,
        phone: this.mobile,
        guardian_phone: this.guardian_mobile,
        dob: this.dob,
        present_address: this.present_addr,
        permanent_address: this.permanent_addr,
        telephone: this.telephone,
        state: this.state,
        email: this.email1,
        email2: this.email2,
        known_from: this.known_from
      }
      //console.log('Application personal sendData: ', sendData);

      this.applicationService.personal_insert(sendData).subscribe(async response => {
        //console.log('Application personal insert response: ', response);
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

          this.student_id = response.inserted_id;
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
        console.log('Application personal insert error: ', error);
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

  async onUpdateVisitor() {
    var mail_format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //--- Numeric, min 10 and max 13, fromat: 9876543210

    var phone_num_format = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/; //--- String, format: demo@domain.co

    if(this.dob != null) {
      let date_split = this.dob.split('T');
      this.dob = date_split[0];
      //console.log('DOB date......', date_split[0]);
    }

    //--- Check empty and invalid credentials
    if(this.student_id == null || this.student_course_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to update!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.course_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select course!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.name.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter name!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.guardian_name.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter guardian name!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.guardian_mobile.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter guardian mobile no!",
        buttons: ['OK']
        });
      alert.present();
    } else if(!phone_num_format.test(this.guardian_mobile)) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid guardian mobile no!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.dob == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select date of birth!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.present_addr.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter present address!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.permanent_addr.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter permanent address!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.telephone.length != 0 && (!phone_num_format.test(this.telephone))) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid telephone no!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.state.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter state!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.email1.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter primary email!",
        buttons: ['OK']
      });
      alert.present();
    } else if(!mail_format.test(this.email1)) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid primary email!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.email2.length != 0 && (!mail_format.test(this.email2))) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid secondary email!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.known_from == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from where you know us!",
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
        id: this.student_id,
        student_course_id: this.student_course_id,
        applied_course_id: this.course_id,
        name: this.name,
        guardian_name: this.guardian_name,
        phone: this.mobile,
        guardian_phone: this.guardian_mobile,
        dob: this.dob,
        present_address: this.present_addr,
        permanent_address: this.permanent_addr,
        telephone: this.telephone,
        state: this.state,
        email: this.email1,
        email2: this.email2,
        known_from: this.known_from
      }
      //console.log('Application personal update sendData: ', sendData);

      this.applicationService.personal_update(sendData).subscribe(async response => {
        //console.log('Application personal update response: ', response);
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
        console.log('Application personal update error: ', error);
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

  async onUpdateActive() {
    var mail_format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //--- Numeric, min 10 and max 13, fromat: 9876543210

    var phone_num_format = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/; //--- String, format: demo@domain.co

    if(this.dob != null) {
      let date_split = this.dob.split('T');
      this.dob = date_split[0];
      //console.log('DOB date......', date_split[0]);
    }

    //--- Check empty and invalid credentials
    if(this.student_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to update!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.name.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter name!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.guardian_name.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter guardian name!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.guardian_mobile.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter guardian mobile no!",
        buttons: ['OK']
        });
      alert.present();
    } else if(!phone_num_format.test(this.guardian_mobile)) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid guardian mobile no!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.dob == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select date of birth!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.present_addr.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter present address!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.permanent_addr.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter permanent address!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.telephone.length != 0 && (!phone_num_format.test(this.telephone))) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid telephone no!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.state.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter state!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.email1.length == 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter primary email!",
        buttons: ['OK']
      });
      alert.present();
    } else if(!mail_format.test(this.email1)) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid primary email!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.email2.length != 0 && (!mail_format.test(this.email2))) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Enter valid secondary email!",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.known_from == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select from where you know us!",
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
        id: this.student_id,
        name: this.name,
        student_course_id: null,
        applied_course_id: null,
        guardian_name: this.guardian_name,
        phone: this.mobile,
        guardian_phone: this.guardian_mobile,
        dob: this.dob,
        present_address: this.present_addr,
        permanent_address: this.permanent_addr,
        telephone: this.telephone,
        state: this.state,
        email: this.email1,
        email2: this.email2,
        known_from: this.known_from
      }
      console.log('Application personal active update sendData: ', sendData);

      this.applicationService.personal_update(sendData).subscribe(async response => {
        console.log('Application personal active update response: ', response);
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
        console.log('Application personal active update error: ', error);
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

  apply_new_course() {
    this.applied_course_list.push({
      id: null,
      student_id: this.student_id,
      course_id: null
    });

    this.show_add_course_btn = false;
  }

  async insert_applied_course(course_index) {
    if(this.applied_course_list[course_index].student_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to insert!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.applied_course_list[course_index].course_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select course!",
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
        student_id: this.applied_course_list[course_index].student_id,
        course_id: this.applied_course_list[course_index].course_id
      }
      //console.log('Application course insert sendData: ', sendData);

      this.applicationService.personal_course_insert(sendData).subscribe(async response => {
        //console.log('Application course insert response: ', response);
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

          this.applied_course_list[course_index].id = response.inserted_id;
          this.show_add_course_btn = true;
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: response.message,
            buttons: ['OK']
          });
          alert.present();
        }
      }, async error => {
        console.log('Application course insert error: ', error);
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

  async edit_applied_course(course_index) {
    if(this.applied_course_list[course_index].id == null || this.applied_course_list[course_index].student_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Unable to insert!",
        buttons: ['OK']
        });
      alert.present();
    } else if(this.applied_course_list[course_index].course_id == null) {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Select course!",
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
        id: this.applied_course_list[course_index].id,
        student_id: this.applied_course_list[course_index].student_id,
        course_id: this.applied_course_list[course_index].course_id
      }
      //console.log('Application course edit sendData: ', sendData);

      this.applicationService.personal_course_edit(sendData).subscribe(async response => {
        //console.log('Application course edit response: ', response);
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
        console.log('Application course edit error: ', error);
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
  
  async remove_applied_course(course_index) {
    if(this.applied_course_list.length > 1) {
      if(this.applied_course_list[course_index].id == null) {
        //--- This course yet not inserted
        this.applied_course_list.splice(course_index, 1);
        this.show_add_course_btn = true;
      } else {
        //--- This routine already submitted and have to be remove from databade

        //--- Check empty and invalid credentials
        if(this.applied_course_list[course_index].id == null || this.student_type == "1") {
          const alert = await this.alertCtrl.create({
            header: 'Error!',
            message: "Unable to remove routine!",
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
            id: this.applied_course_list[course_index].id
          }
          //console.log('Application course remove sendData: ', sendData);

          this.applicationService.personal_course_remove(sendData).subscribe(async response => {
            //console.log('Application course response: ', response);
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

              this.applied_course_list.splice(course_index, 1);
            } else {
              const alert = await this.alertCtrl.create({
                header: 'Error!',
                message: response.message,
                buttons: ['OK']
              });
              alert.present();
            }
          }, async error => {
            console.log('Application course remove error: ', error);
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
    } else {
      const toast = await this.toastController.create({
        message: "Minimum one course need to remain",
        color: "dark",
        position: "bottom",
        duration: 2000
      });
      toast.present();
    }
  }

  moveNext() {
    this.router.navigate(['/application-education', {id: this.student_id}]);
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
