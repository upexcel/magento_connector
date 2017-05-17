import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';
@Injectable()

export class LogoutService {
    constructor(private _dataConfigService: AppDataConfigService, private _local: Storage) { }
    logout(msg, _navCtrl?) {
        this._dataConfigService.resetDataInService();
        this._local.clear();
    }
}