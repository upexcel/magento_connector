import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {App} from 'ionic-angular';
import {AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';
import { StartPage } from './../../pages/startpage/startpage';

@Injectable()

export class LogoutService {
    constructor(private app: App,private _dataConfigService: AppDataConfigService, private _local: Storage) { }
    logout(msg,_navCtrl?) {
        var nav = this.app.getActiveNav();
        this._dataConfigService.resetDataInService();
        this._local.clear();
        nav.popToRoot(StartPage);
    }
}