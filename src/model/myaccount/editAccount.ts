import {Injectable} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import {EditAccountDataType} from './editAccountData';
@Injectable()
export class Edit {
    constructor(private _apiService: ApiService) {}
    /**
    *updateAddress
    *use to call address/edit
    **/
    updateAddress(data): Promise<EditAccountDataType> {
        return new Promise((resolve, reject) => {
            this._apiService.api("address/edit", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    /**
*editAccount
*use to call account/edit
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
