import { Component, OnInit, ViewChild} from '@angular/core';
import { Slides} from 'ionic-angular';
import { ViewController, NavController } from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import {TourService} from '../../providers/tour-service/tourService';
import {LoginPage} from './../login/login';
import forEach from 'lodash/forEach';
import clone from 'lodash/clone';
import keys from 'lodash/keys';
import { Storage } from '@ionic/storage';
import { TourDataType } from './../data/tourDataType';
import { config } from './../../providers/config/config';
@Component({
    templateUrl: 'tour.html'
})
export class TourPage implements OnInit {
    data : TourDataType = {
        logo: "",
        logo_alt: "",
        desc: "",
        descriptions: ""
    };
    mySlideOptions = config.mySlideOptions;  
    getStarted_show: boolean = false;
    constructor(private _tourService: TourService, public local: Storage, public navCtrl: NavController, public viewCtrl: ViewController, public _formService: FormService) { }
    ngOnInit() {
        let res = this._tourService.setData();
        if (keys(res).length > 0) {
            this.getTour(res);
        }
        else {
            this._tourService.setData().then((res) => {
                this.getTour(res);
            })
        }
    }
    close() {
        this.viewCtrl.dismiss();
    }
    getTour(res) {
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

