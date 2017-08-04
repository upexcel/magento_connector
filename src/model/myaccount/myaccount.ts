import {Injectable} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import {MyAccountAddressDataType} from './myaccountData';
@Injectable()
export class MyAccount {
    constructor(private _apiService: ApiService) {}
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
        return new Promise((resolve, reject) => {
            this._apiService.api("address/addressdelete", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
