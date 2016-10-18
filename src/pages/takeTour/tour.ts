import { Component, OnInit} from '@angular/core';
import { Slides} from 'ionic-angular';
import { ViewController, NavController } from 'ionic-angular';
import {AppConfig} from '../../providers/appConfig/appConfig';
import {LoginPage} from './../login/login';
import forEach from 'lodash/forEach';
import clone from 'lodash/clone';
import keys from 'lodash/keys';
import { Storage } from '@ionic/storage';
import { ConfigDataType } from './configDataType';
import { config } from './../../providers/config/config';
@Component({
    templateUrl: 'tour.html'
})
export class TourPage implements OnInit {
    data: ConfigDataType = {
        tour_logo: "",
        logo_alt: "",
        tour_slider: ""
    };
    descriptions: string;
    mySlideOptions = config.tourPageSliderOptions;
    constructor(private _appConfig: AppConfig, public _local: Storage, public _navCtrl: NavController, public _viewCtrl: ViewController) { }
    ngOnInit() {
        let res = this._appConfig.getAppConfig();
        if (res) {
            let res_data: any = [];
            this.data = res;
            forEach(this.data.tour_slider, function(value, key) {
                res_data.push(value);
            })
            this.descriptions = clone(res_data);
        }
    }
    close() {
        this._viewCtrl.dismiss();
    }
    gotoLogin() {
        this._navCtrl.push(LoginPage);
    }

}

