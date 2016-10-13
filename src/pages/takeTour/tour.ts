import { Component, OnInit} from '@angular/core';
import { Slides} from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import  _ from 'lodash';
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
        autoplay: 3000,
        initialSlide: 1,
        loop: true,
        pager: true
    };
    constructor(public local: Storage, public viewCtrl: ViewController, public _formService: FormService) {
        console.clear();
            this.local.get('store_id').then((value: any) => {
                    this.store_id =  JSON.parse(value);
                    });
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
            this.logo = JSON.parse(res.body).data.tour_logo;
            this.logo_alt = JSON.parse(res.body).data.logo_alt;
            this.desc = JSON.parse(res.body).data.tour_slider;
            _.forEach(this.desc, function(value, key) {
                res_data.push(value);
            })
            this.descriptions = _.clone(res_data);
        })
    }
}

