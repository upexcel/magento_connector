import {
    Injectable
} from '@angular/core';
import {
    Storage
} from '@ionic/storage';
import { GenericAnalytics } from './../genericAnalytics/genericAnalytics';
@Injectable()

export class LogoutService {
    constructor(public _genericAnalytic: GenericAnalytics, private _local: Storage) { }
    logout(msg, _navCtrl) {
        this._genericAnalytic.setUserId("false");
        this._local.clear();
    }
}