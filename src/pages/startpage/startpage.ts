import { Component, OnInit} from '@angular/core';
import { ModalController, NavController, NavParams, AlertController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import { TourPage } from '../takeTour/tour';
import { Storage } from '@ionic/storage';
import {ApiService } from './../../providers/api-service/api-service';
import {HomePage} from '../../pages/home/home';
@Component({
    templateUrl: 'startpage.html'
})
export class StartPage implements OnInit {
    messsage_expired: string;
    logo: string;
    logo_alt: string;
    website_id: string;
    store_id: string;
    background_image: string;
    check: boolean = false;
    options: {};
    constructor(private _local: Storage, private _navCtrl: NavController, private _navparam: NavParams, private _modalCtrl: ModalController, private _apiService: ApiService, private _alertCtrl: AlertController) { }
    ngOnInit() {
        this.getlogo();
        this.messsage_expired = this._navparam.get("message")
    }

    gotologin() {
        this._navCtrl.push(LoginPage);
    }

    presentProfileModal() {
        let profileModal = this._modalCtrl.create(TourPage);
        profileModal.present();
    }
    getlogo() {
        let body = {};
        this._apiService.api("web/config", body).subscribe((res) => {
            let parse = JSON.parse(res.body);
            this.logo = parse.data.logo_url;
            this.background_image = parse.data.background_image;
            this.logo_alt = parse.data.logo_alt;
            this.website_id = parse.data.website_id;
            this.store_id = parse.data.store_id;
            this._local.set('website_id', this.website_id);
            this._local.set('store_id', this.store_id);
            this.check = true;
        });
    }
    userFbLogin(body) {
        this._local.set("fbProfileDate", body);
        this._navCtrl.setRoot(HomePage);
    }
    userGoogleLogin(body) {
        this._local.set("googleData", body);
        this._navCtrl.setRoot(HomePage);
    }
    showSocialLoginError(error) {
        let alert = this._alertCtrl.create({
            title: 'Error',
            subTitle: error,
            buttons: ['OK']
        });
        alert.present();
    }
}