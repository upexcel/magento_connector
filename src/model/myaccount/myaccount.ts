import {Injectable} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import {MyAccountAddressDataType} from './myaccountData';
import {LoadingController} from 'ionic-angular';

@Injectable()
export class MyAccount {
    constructor(public loadingCtrl: LoadingController,private _apiService: ApiService) {}
    getMyAccount(data): Promise<MyAccountAddressDataType> {
        return new Promise((resolve, reject) => {
            this._apiService.api("account/address/", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    deleteMyAddress(data) {
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        return new Promise((resolve, reject) => {
            this._apiService.api("address/addressdelete", data).subscribe((res) => {
                loading.dismiss();
                resolve(res);
            }, (err) => {
                loading.dismiss();
                reject(err);
            });
        });
    }
}
