import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {CartFunction} from './../../model/cart/cartHandling';

@Injectable()
/**
*this service is use for logout and reset service and clear local storage
**/
export class LogoutService {
    constructor(private _cartFunction: CartFunction, private _dataConfigService: AppDataConfigService, private _local: Storage) {}
    logout(msg, _navCtrl?) {
        this._cartFunction.resetCart();
        this._dataConfigService.resetDataInService();
        this._local.clear();
    }
}