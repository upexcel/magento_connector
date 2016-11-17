import {
    Injectable
} from '@angular/core';
import {
    Storage
} from '@ionic/storage';
import {
    GooglePlus
} from 'ionic-native';
import {
    NavController
} from 'ionic-angular';
import {
    StartPage
} from './../../pages/startpage/startpage';
@Injectable()

export class LogoutService {
    constructor(private _local: Storage, private _navCtrl: NavController) {}
    logout(msg) {
        let self = this;
        this._local.remove('firstname').then(() => {
            this._local.remove('lastname').then(() => {
                this._local.remove('expiry').then(() => {
                    this._local.remove('access_token').then(() => {
                        this._local.remove('lists').then(() => {
                            this._local.remove('email').then(() => {
                                this._local.remove('secret').then(() => {
                                    this._local.remove('categorylist').then(() => {
                                        this._local.remove('homeProducts').then(() => {
                                            this._local.remove('slider').then(() => {
                                                this._local.remove('web_config').then(() => {
                                                    GooglePlus.logout();
                                                    self._navCtrl.setRoot(StartPage, {
                                                        "message": msg
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }