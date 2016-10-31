import { Component, OnInit, ViewChild} from '@angular/core';
import { Slides} from 'ionic-angular';
import { ViewController, NavController } from 'ionic-angular';
import {AppConfig} from '../../model/appConfig/appConfig';
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
    data: ConfigDataType;
    descriptions: string;
    mySlideOptions = config.tourPageSliderOptions;
    constructor(private _appConfig: AppConfig, public _local: Storage, public _navCtrl: NavController, public _viewCtrl: ViewController, private _apiService: ApiService) { }
    ngOnInit() {
        this._appConfig.getAppConfig().then((res) => {
            this.data = res;
        });
    }
    close() {
        this._viewCtrl.dismiss();
    }
    gotoLogin() {
        this._navCtrl.push(LoginPage);
    }

}

