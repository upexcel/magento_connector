import { Injectable} from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import {MyAccountAddressDataType} from './myaccountData';
@Injectable()
export class MyAccount {
    constructor(private _apiService: ApiService) { }
    getMyAccount(data):Promise<MyAccountAddressDataType> {
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api("account/address/", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
