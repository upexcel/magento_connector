import { Component, OnInit, ViewChild} from '@angular/core';
import { Slides} from 'ionic-angular';
import { ViewController, NavController } from 'ionic-angular';
import {AppConfig} from '../../modal/appConfig/appConfig';
import {ApiService } from './../../providers/api-service/api-service';
import {LoginPage} from './../login/login';
import { Storage } from '@ionic/storage';
import { ConfigDataType } from './configDataType';
import { config } from './../../providers/config/config';
import forEach from 'lodash/forEach';
import clone from 'lodash/clone';
import keys from 'lodash/keys';
@Component({
    templateUrl: 'tour.html'
})
export class TourPage implements OnInit {
    data: ConfigDataType = {
        data: {
            tour_logo: "",
            logo_url: "",
            logo_alt: "",
            tour_slider: "",
            background_image: "",
            website_id: "",
            store_id: ""
        }
    };
    descriptions: string;
    mySlideOptions = config.tourPageSliderOptions;
    constructor(private _appConfig: AppConfig, public _local: Storage, public _navCtrl: NavController, public _viewCtrl: ViewController, private _apiService: ApiService) { }
    ngOnInit() {
        this._appConfig.getAppConfig().then((res) => {
            let res_data: any = [];
            this.data = res;
            forEach(this.data.data.tour_slider, function(value, key) {
                res_data.push(value);
            })
            this.descriptions = clone(res_data);
        });
    }
    close() {
        this._viewCtrl.dismiss();
    }
    gotoLogin() {
        this._navCtrl.push(LoginPage);
    }

}

