import { Component, OnInit, ViewChild} from '@angular/core';
import { Slides} from 'ionic-angular';
import { ViewController, NavController } from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import {LoginPage} from './../login/login'
import _ from 'lodash';
import { Storage } from '@ionic/storage';
@Component({
    templateUrl: 'tour.html'
})
export class tourPage implements OnInit {
    store_id: any;
    logo: any;
    logo_alt: any;
    desc: any;
    descriptions: any;
    mySlideOptions = {
        initialSlide: 0,
        autoplay: 2000,
        loop: true,
        pager: true
    };
    getStarted_show: boolean;
    constructor(public local: Storage, public navCtrl: NavController, public viewCtrl: ViewController, public _formService: FormService) {

    }

    ngOnInit() {
        this.local.get('store_id').then((value: any) => {
            this.store_id = JSON.parse(value);
        });
        this.getTour();

    }
    close() {
        this.viewCtrl.dismiss();
    }
    getTour() {
        let res_data: any = [];
        let body = { store_id: this.store_id };
        this._formService.api("web/config", body).subscribe((res) => {
            this.getStarted_show = true;
            this.logo = JSON.parse(res.body).data.tour_logo;
            this.logo_alt = JSON.parse(res.body).data.logo_alt;
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

