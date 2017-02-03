import {
    Injectable
} from '@angular/core';
import {
    Storage
} from '@ionic/storage';


@Injectable()

export class LogoutService {
    constructor(private _local: Storage) {}
    logout(msg,_navCtrl) {
        this._local.clear();
    }
}