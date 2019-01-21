import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { RestApiService } from '../rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  page: any = {};

  cardImagePresent = false;

  cardButtonPresent = false;

  cardTextPresent = false;

  constructor(public api: RestApiService,
  public loadingController: LoadingController,
  public route: ActivatedRoute,
  public router: Router) { }

  ngOnInit() {
    this.getPage();
  }

  async getPage() {
    const loading = await this.loadingController.create();
    await loading.present();
    await this.api.getPage(this.route.snapshot.paramMap.get('id'))
      .subscribe(res => {
        console.log(res);
        if(res.included[2]){
          this.cardImagePresent = true;
          this.getImage(res.included[2].attributes.file_id);
        }
        let cardTitle = res.included[0].attributes.title;
        let cardText = "";
        let cardButton = "#";
        if(res.included[3]){
          this.cardTextPresent = true;
          cardText = res.included[3].attributes.content;
        }
        if(res.included[1]){
          this.cardButtonPresent = true;
          cardButton = res.included[1].attributes.url;
        }
        this.page = {
          title: res.data.attributes.title,
          cardTitle: cardTitle,
          cardText: cardText,
          cardButton: cardButton
        }
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  async getImage(id: String) {
    await this.api.getImage(id)
      .subscribe(imgRes => {
        console.log(imgRes);
        this.page['cardImage'] = imgRes.data.attributes.effective_uri
      });
  }
}
