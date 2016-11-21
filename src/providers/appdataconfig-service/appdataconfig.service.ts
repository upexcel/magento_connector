import {
    Injectable
} from '@angular/core';
import {
    Storage
} from '@ionic/storage';
@Injectable()

export class AppDataConfigService {
    constructor(private _local: Storage) {}
    setUserData(userData) {
        this._local.set('userData', userData);
    }
}