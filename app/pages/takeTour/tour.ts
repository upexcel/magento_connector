import { Component, OnInit} from '@angular/core';
import { Slides, Storage, LocalStorage, NavController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import {LoginPage} from '../login/login';
import * as _ from 'lodash'
@Component({
    templateUrl: 'build/pages/takeTour/tour.html',
    providers: [FormService]
})
export class tourPage implements OnInit {
    local: any;
    store_id: any;
    logo: any;
    logo_alt: any;
    desc: any;
    descriptions: any;
    mySlideOptions = {
        initialSlide: 1,
        loop: false,
        pager: true
    };
    getStarted_show: boolean;
    constructor(private viewCtrl: ViewController, private navCtrl: NavController, private _formService: FormService) {
        console.clear();
        this.local = new Storage(LocalStorage);
        this.store_id = localStorage.getItem('store_id');
    }
    ngOnInit() {
        this.getTour();
    }
    close() {
        this.viewCtrl.dismiss();
    }
    getTour() {
        var res_data: any = [];
        var body = { store_id: this.store_id };
        this._formService.api("web/config", body).subscribe((res) => {
            this.getStarted_show = true;
            this.logo = JSON.parse(res.body).data.tour_logo
            this.logo_alt = JSON.parse(res.body).data.logo_alt
            this.desc = JSON.parse(res.body).data.tour_slider;
            _.forEach(this.desc, function(value, key) {
                res_data.push(value);
            })
            this.descriptions = _.clone(res_data);
        })
    }
    gotologin() {
        this.navCtrl.push(LoginPage);
    }
}

