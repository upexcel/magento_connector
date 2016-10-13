import { Component, OnInit} from '@angular/core';
import { ModalController, NavController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import { tourPage } from '../takeTour/tour';
import { PopoverController } from 'ionic-angular';
import {HomePage} from '../home/home';
import { Storage } from '@ionic/storage';
import {FormService } from './../../providers/form-service/form-service';

@Component({
    templateUrl: 'startpage.html'
})

export class StartPage implements OnInit {
 firstname: any;
    lastname: any;
    access_token: any;
    expiry: any;
    messsage_expired: any;
    logo: any;
    logo_alt: any;
    website_id: any;
    store_id: any;
    background_image: any;
    check:boolean= false;
    constructor( public _formService: FormService,public local: Storage, public navCtrl: NavController, public popoverCtrl: PopoverController, public modalCtrl: ModalController) {
              this.getlogo();
          console.clear();
    }
    ngOnInit() {
    }

    gotologin() {
        this.navCtrl.push(LoginPage);
    }

    presentProfileModal() {
        let profileModal = this.modalCtrl.create(tourPage);
        profileModal.present();
    }
    getlogo() {
        var body = {};
        this._formService.api("web/config", body).subscribe((res) => {
            var parse=JSON.parse(res.body);
            this.logo = parse.data.logo_url;
            this.background_image = parse.data.background_image;
            this.logo_alt = parse.data.logo_alt;
            this.website_id = parse.data.website_id;
            this.store_id = parse.data.store_id;
            this.local.set('website_id', this.website_id);
            this.local.set('store_id', this.store_id);
            this.check=true;
        });
    }
}