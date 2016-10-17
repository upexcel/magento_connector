import { Component, OnInit, ViewChild} from '@angular/core';
import { Slides} from 'ionic-angular';
import { ViewController, NavController } from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import {LoginPage} from './../login/login';
import forEach from 'lodash/forEach';
import clone from 'lodash/clone';
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
    constructor(public local: Storage, public navCtrl: NavController, public viewCtrl: ViewController, public _formService: FormService) { }

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
            let body = JSON.parse(res.body).data;
            this.logo = body.tour_logo;
            this.logo_alt = body.logo_alt;
            this.desc = body.tour_slider;
            forEach(this.desc, function(value, key) {
                res_data.push(value);
            })
            this.descriptions = clone(res_data);
        })
    }
    gotologin() {
        this.navCtrl.push(LoginPage);
    }
}

