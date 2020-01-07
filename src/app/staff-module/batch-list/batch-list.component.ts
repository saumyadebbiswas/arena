import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { StaffWorkService } from 'src/app/services';

@Component({
  selector: 'app-batch-list',
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.scss'],
})
export class BatchListComponent implements OnInit {
  
  message: string = "Loading...";
  batch_list_fix: any = [];
  batch_list: any = [];
  user_type: string;

  constructor(
    private router: Router,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public staffWorkService: StaffWorkService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() { 
    console.log('Location: BatchListComponent');

    this.active_batch_all();
  }

  async active_batch_all() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.staffWorkService.active_batch_list().subscribe(async response => {
      //console.log('Active batch list...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.batch_list_fix = response.data;
        this.batch_list = response.data;
      } else {
        this.message = "No Batch Available!"
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.message = "Unable load data!"
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Oops! Internal problem.",
        buttons: ['OK']
      });
      alert.present();
    });
  }
  
  searchList(event) {
    let search_value = event.target.value;

    this.batch_list = [];

    if(search_value.length >= 3) {
      this.batch_list_fix.forEach(element => {
        let name = element.name.toLowerCase();
        search_value = search_value.toLowerCase();

        if(name.includes(search_value)){
          this.batch_list.push(element);
        }
      });
    } else {
      this.batch_list = this.batch_list_fix;
    }
  }

  moveBatchEdit(batch_id) {
    this.router.navigate(['/batch-edit', {id: batch_id}]);
  }

  moveRoutineAssign(batch_id) {
    this.router.navigate(['/routine-assign', {id: batch_id}]);
  }

}
