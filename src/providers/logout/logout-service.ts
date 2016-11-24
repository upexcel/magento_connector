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
        this._local.clear();
        _navCtrl.setRoot(StartPage, { "message": msg });
    }
}