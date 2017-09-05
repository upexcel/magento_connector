import {Injectable} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import {EditAccountDataType} from './editAccountData';
import {LoadingController} from 'ionic-angular';

@Injectable()
export class Edit {
    constructor(public loadingCtrl: LoadingController,private _apiService: ApiService) {}
    /**
    *updateAddress
    * call address/edit api
    **/
    updateAddress(data): Promise<EditAccountDataType> {
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        return new Promise((resolve, reject) => {
            this._apiService.api("address/edit", data).subscribe((res) => {
                loading.dismiss();
                resolve(res);
            }, (err) => {
                loading.dismiss();
                reject(err);
            });
        });
    }
    /**
    *editAccount
    *    call account/edit api
    **/
    editAccount(data) {
        return new Promise((resolve, reject) => {
            this._apiService.api("account/edit", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
