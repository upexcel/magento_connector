import { Component, OnInit, ViewChild} from '@angular/core';
import { Slides} from 'ionic-angular';
import { ViewController, NavController } from 'ionic-angular';
import {ApiService } from './../../providers/api-service/api-service';
import {LoginPage} from './../login/login';
import _ from 'lodash';
import { Storage } from '@ionic/storage';
@Component({
    templateUrl: 'tour.html'
})
export class TourPage implements OnInit {
    store_id: string;
    logo: string;
    logo_alt: string;
    desc: string;
    descriptions: string;
    mySlideOptions = {
        initialSlide: 0,
        autoplay: 2000,
        loop: true,
        pager: true
    };
    getStarted_show: boolean = false;
    constructor(private _local: Storage, private _navCtrl: NavController, private _viewCtrl: ViewController, private _apiService: ApiService) { }

    ngOnInit() {
        this._local.get('store_id').then((value: any) => {
            this.store_id = JSON.parse(value);
        });
        this.getTour();

    }
    close() {
        this._viewCtrl.dismiss();
    }
    getTour() {
        let res_data: any = [];
        let body = { store_id: this.store_id };
        this._apiService.api("web/config", body).subscribe((res) => {
            this.getStarted_show = true;
            let body = JSON.parse(res.body).data;
            this.logo = body.tour_logo;
            this.logo_alt = body.logo_alt;
            this.desc = body.tour_slider;
            _.forEach(this.desc, function(value, key) {
                res_data.push(value);
            })
            this.descriptions = _.clone(res_data);
        })
    }
    gotologin() {
        this._navCtrl.push(LoginPage);
    }
}

