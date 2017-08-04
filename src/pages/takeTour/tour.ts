import {Component, OnInit} from '@angular/core';
import {ViewController, NavController, Events} from 'ionic-angular';
import {AppConfig} from '../../model/appConfig/appConfig';
import {ApiService} from './../../providers/api-service/api-service';
import {Storage} from '@ionic/storage';
import {ConfigDataType} from '../../model/appConfig/configDataType';
import {config} from './../../providers/config/config';
@Component({
    selector: 'tour',
    templateUrl: 'tour.html'
})
export class TourPage implements OnInit {
    data: ConfigDataType;
    descriptions: string;
    mySlideOptions = config.tourPageSliderOptions;
    constructor(private events: Events, private _appConfig: AppConfig, public _local: Storage, public _navCtrl: NavController, public _viewCtrl: ViewController, private _apiService: ApiService) {}
    ngOnInit() {
        this._appConfig.getAppConfig().then((res) => {
            this.data = res;
            console.log("res",this.data.body.tour_slider);
        });
    }
    close() {
        this._viewCtrl.dismiss();
    }
    /**
    * gotoHome
    *
    * Use of this source code is to throw event and dismiss view
    **/
    gotoHome() {
        this.events.publish('goHome:home');
        setTimeout(() => {
            this._viewCtrl.dismiss();
        }, 100);
    }

}
