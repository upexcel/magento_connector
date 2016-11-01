import { Component, OnInit} from '@angular/core';
import { ModalController, NavController, NavParams, AlertController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import { TourPage } from '../takeTour/tour';
import { Storage } from '@ionic/storage';
import {AppConfig} from '../../model/appConfig/appConfig';
import { config } from './../../providers/config/config';
import {SocialService} from '../../providers/social-service/social-service';
import {HomePage} from '../../pages/home/home';
import { ConfigDataType } from '../takeTour/configDataType';
import { SocialAccountDataType } from './socialAccountDataType';
import { SocialAccount } from './../../model/startPage/socialAccount';
@Component({
    templateUrl: 'startpage.html'
})
export class StartPage implements OnInit {
    data: ConfigDataType;
    socialData: SocialAccountDataType;
    messsage_expired: string;
    check: boolean = false;
    options: {};
    constructor(private _socialAccount: SocialAccount, private _appConfig: AppConfig, public _local: Storage, public _socialProvider: SocialService, private _alertCtrl: AlertController,
        private _navCtrl: NavController, private _navparam: NavParams,
        private _modelCtrl: ModalController) {
    }

    ngOnInit() {
        this.messsage_expired = this._navparam.get("message");
        this.options = {
            clientid: config.google_clientid
        }

        this._appConfig.getAppConfig().then((res) => {
            this.data = res;
            this._local.set('website_id', this.data.data.website_id);
            this._local.set('store_id', this.data.data.store_id);
            this._local.set('require_login', this.data.data.store_id);
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
        let profileModal = this._modelCtrl.create(TourPage);
        profileModal.present();
    }
    userFbLogin(body) {
        this._socialAccount.getSocialAccount(body.data).then((res) => {
            this.socialData = res;
            this._local.set("access_token", body.token.access_token);
            this._navCtrl.setRoot(HomePage);
        });
    }
    userGoogleLogin(body) {
        this._socialAccount.getSocialAccount(body).then((res) => {
            this.socialData = res;
            this._local.set("googleData", body);
            this._navCtrl.setRoot(HomePage);
        });
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
