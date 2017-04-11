import { Injectable } from '@angular/core';
import { ApiService } from './../../providers/api-service/api-service';
import { MyAccountAddressDataType } from './myaccountData';
@Injectable()
export class MyReviewData {
    constructor(private _apiService: ApiService) { }
    getMyDownlodeData(data): Promise<MyAccountAddressDataType> {
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api("account/getReviews", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}