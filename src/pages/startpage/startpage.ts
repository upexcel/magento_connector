import { Component, OnInit} from '@angular/core';
import { ModalController, NavController, NavParams, AlertController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import { TourPage } from '../takeTour/tour';
import { Storage } from '@ionic/storage';
import {AppConfig} from '../../modal/appConfig/appConfig';
import { config } from './../../providers/config/config';
import {SocialService} from '../../providers/social-service/social-service';
import {HomePage} from '../../pages/home/home';
import { ConfigDataType } from '../takeTour/configDataType';
@Component({
    templateUrl: 'startpage.html'
})
export class StartPage implements OnInit {
    data: ConfigDataType = {
        data: {
            tour_logo: "",
            logo_url: "",
            logo_alt: "",
            tour_slider: "",
            background_image: "",
            website_id: "",
            store_id: ""
        }
    };
    messsage_expired: string;
    check: boolean = false;
    options: {};
    constructor(private _appConfig: AppConfig, public _local: Storage, public _socialProvider: SocialService, private _alertCtrl: AlertController,
        private _navCtrl: NavController, private _navparam: NavParams,
        private _modalCtrl: ModalController) {
    }

    ngOnInit() {
        this.messsage_expired = this._navparam.get("message");
        this.options = {
            clientid: config.google_clientid
        }

        this._appConfig.getAppConfig().then((res) => {
            this.data = res;
            this._local.set('website_id', res.data.website_id);
            this._local.set('store_id', res.data.store_id);
            this.check = true;
        })
            .catch((err) => {
                this.showSocialLoginError(err);
            });
    }
    gotologin() {
        this._navCtrl.push(LoginPage);
    }
    presentProfileModal() {
        let profileModal = this._modalCtrl.create(TourPage);
        profileModal.present();
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
