import { Component, OnInit, ViewChild} from '@angular/core';
import { Slides} from 'ionic-angular';
import { ViewController, NavController } from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import {AppConfig} from '../../providers/appConfig/appConfig';
import {LoginPage} from './../login/login';
import forEach from 'lodash/forEach';
import clone from 'lodash/clone';
import keys from 'lodash/keys';
import { Storage } from '@ionic/storage';
import { TourDataType } from './tourDataType';
import { config } from './../../providers/config/config';
@Component({
    templateUrl: 'tour.html'
})
export class TourPage implements OnInit {
    data: TourDataType = {
        logo: "",
        logo_alt: "",
        desc: "",
        descriptions: ""
    };
    mySlideOptions = config.tourPageSliderOptions;
    getStarted_show: boolean = false;
    constructor(private _tourService: AppConfig, public local: Storage, public navCtrl: NavController, public viewCtrl: ViewController, public _formService: FormService) { }
    ngOnInit() {
        let res = this._tourService.getAppConfig();
        if (keys(res).length > 0) {
            this.setTour(res);
        }
        else {
            this._tourService.setData().then((res) => {
                this.setTour(res);
            })
        }
    }
    close() {
        this.viewCtrl.dismiss();
    }
    setTour(res) {
        let res_data: any = [];
        this.getStarted_show = true;
        this.data.logo = res.tour_logo;
        this.data.logo_alt = res.logo_alt;
        this.data.desc = res.tour_slider;
        forEach(this.data.desc, function(value, key) {
            res_data.push(value);
        })
        this.data.descriptions = clone(res_data);
    }
    gotoLogin() {
        this.navCtrl.push(LoginPage);
    }

}

