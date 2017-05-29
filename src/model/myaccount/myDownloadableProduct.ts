import { Injectable} from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import {MyAccountAddressDataType} from './myaccountData';
@Injectable()
export class MyDownlodeData {
    constructor(private _apiService: ApiService) { }
    getMyDownlodeData(data):Promise<MyAccountAddressDataType> {
        return new Promise((resolve, reject)=> {
            this._apiService.api("account/getdownloadable", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}