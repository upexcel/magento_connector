import { Component, OnInit} from '@angular/core';
import { ModalController, NavController, Storage, LocalStorage, NavParams} from 'ionic-angular';
import {LoginPage} from '../login/login';
import { tourPage } from '../takeTour/tour';
import { PopoverController } from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
@Component({
    templateUrl: 'build/pages/startpage/startpage.html',
    providers: [FormService]
})

export class StartPage implements OnInit {

    firstname: any;
    lastname: any;
    access_token: any;
    expiry: any;
    local: any;
    messsage_expired: any;
    logo: any;
    logo_alt: any;
    website_id: any;
    store_id: any;
    background_image: any;
    constructor(private navCtrl: NavController, private navparam: NavParams, public modalCtrl: ModalController, private _formService: FormService) {
        this.local = new Storage(LocalStorage);
        this.messsage_expired = this.navparam.get("message")
         console.clear();
    }
    ngOnInit() {
        this.getlogo();
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
            this.logo = JSON.parse(res.body).data.logo_url;
            this.background_image = JSON.parse(res.body).data.background_image;
            this.logo_alt = JSON.parse(res.body).data.logo_alt;
            this.website_id = JSON.parse(res.body).data.website_id;
            this.store_id = JSON.parse(res.body).data.store_id;
            this.local.set("website_id", this.website_id);
            this.local.set("store_id", this.store_id);
        })
    }

}