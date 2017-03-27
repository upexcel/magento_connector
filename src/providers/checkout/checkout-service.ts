import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {ApiService} from './../../providers/api-service/api-service';
@Injectable()

export class checkoutService {
    constructor(private _appConfigService: AppDataConfigService, private _local: Storage, private _apiService: ApiService) {}
    getShippingMethods() {
        return new Promise((resolve, reject) => {
            this._appConfigService.getUserData().then((userData: any) => {
                let data = {"secret": userData.secret};
                this._apiService.api("cart/getShippingMethods/", data).subscribe((res) => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            })
        });
    }
}