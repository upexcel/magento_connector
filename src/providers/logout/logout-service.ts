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
    constructor(private _local: Storage) {}
    logout(msg,_navCtrl) {
        this._local.remove('userData').then(() => {
            this._local.remove('lists').then(() => {
                this._local.remove('categorylist').then(() => {
                    this._local.remove('homeProducts').then(() => {
                        this._local.remove('slider').then(() => {
                            this._local.remove('web_config').then(() => {
                                    _navCtrl.setRoot(StartPage, {
                                    "message": msg
                                });
                            });
                        });
                    });
                });
            });
        });
    }
}