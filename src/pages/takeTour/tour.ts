import { Component, OnInit } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';
import { AppConfig } from '../../model/appConfig/appConfig';
import { ApiService } from './../../providers/api-service/api-service';
import { Storage } from '@ionic/storage';
import { ConfigDataType } from './configDataType';
import { config } from './../../providers/config/config';
import { HomePage } from './../home/home';
import { GenericAnalytics } from './../../providers/genericAnalytics/genericAnalytics';
@Component({
    templateUrl: 'tour.html'
})
export class TourPage implements OnInit {
    data: ConfigDataType;
    descriptions: string;
    mySlideOptions = config.tourPageSliderOptions;
    constructor(public _genericAnalytic: GenericAnalytics, private _appConfig: AppConfig, public _local: Storage, public _navCtrl: NavController, public _viewCtrl: ViewController, private _apiService: ApiService) { }
    ngOnInit() {
        this._appConfig.getAppConfig().then((res) => {
            this.data = res;
        });
    }
    ionViewWillEnter() {
        this._genericAnalytic.setTrackView("tour Page");
    }
    close() {
        this._viewCtrl.dismiss();
    }
    gotoHome() {
        this._navCtrl.setRoot(HomePage);
    }

}
