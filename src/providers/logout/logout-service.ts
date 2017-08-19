import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {CartFunction} from './../../model/cart/cartHandling';
import {EventService} from './../../providers/headerEvents/headerEvents';

@Injectable()
/**
*this service is use for logout and reset service and clear local storage
**/
export class LogoutService {
    constructor(public _eventService: EventService,private _cartFunction: CartFunction, private _dataConfigService: AppDataConfigService, private _local: Storage) {}
    logout(msg, _navCtrl?) {
        this._cartFunction.resetCart();
        this._dataConfigService.resetDataInService();
        this._eventService.setWishList(0);
        this._eventService.setCartCounter(0);
        this._local.remove("userData");
    }
}