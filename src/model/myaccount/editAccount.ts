import { Injectable} from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import {EditAccountDataType} from './editAccountData';
@Injectable()
export class EditAccount {
    constructor(private _apiService: ApiService) { }
    updateAccount(data):Promise<EditAccountDataType> {
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api("address/edit", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
