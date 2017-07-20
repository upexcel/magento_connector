import {Injectable} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import {MyAccountAddressDataType} from './myaccountData';
@Injectable()
export class MyReviewData {
    constructor(private _apiService: ApiService) {}
    getMyDownlodeData(): Promise<MyAccountAddressDataType> {
        return new Promise((resolve, reject) => {
            this._apiService.api("account/getReviews", {}).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}