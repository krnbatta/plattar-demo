import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { LoadingController } from '@ionic/angular';
import { RestApiService } from './rest-api.service';

import { ActivatedRoute, Router  } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {
  public pages;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public api: RestApiService,
    private route: ActivatedRoute,
    public router: Router,
    public loadingController: LoadingController
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.getPages();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  pageClick(id) {
    this.router.navigate(['/detail', id]);
  }

  async getPages() {
    const loading = await this.loadingController.create();
    await loading.present();
    await this.api.getPages()
      .subscribe(res => {
        console.log(res);
        this.pages = res.data.map((page) => {
          return {
            title: page.attributes.title,
            id: `${page.id}`,
            icon: 'home'
          }
        });
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

}
