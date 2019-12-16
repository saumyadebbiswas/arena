import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserService, VisitorsService } from '../services';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit {

  message: string = "Loading..."
  video_list: any = [];
  trustedVideoUrl: SafeResourceUrl;
  array_of_objects: any = [];

  constructor(
    private router: Router,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public userService: UserService,
    public visitorsService: VisitorsService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {}

  ionViewWillEnter() { 
    if(this.userService.currentUserValue == null) {
      this.router.navigate(['/login']);
    } else {
      console.log('Location: VideosComponent');

      this.videos_all();
    }
  }

  async videos_all() {
    //--- Start loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'bubbles'
    });
    loading.present();

    this.visitorsService.videos_list().subscribe(async response => {
      console.log('Video list details...', response);
      //--- After get record - dismiss loader
      this.loadingController.dismiss();

      if(response.status == true) {
        this.video_list = response.data;

        for(let video of this.video_list){
          video.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(video.link);
        }
      } else {
        this.message = "No Video Available!"
      }
    }, async error => {
      //--- In case of any error - dismiss loader, show error message
      this.message = "Unable to load videos!"
      this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: "Internal problem! Unable to load videos.",
        buttons: ['OK']
      });
      alert.present();
    });
  }

}