import { Injectable}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import {TotalOrderDataType  } from './totalOrderDataType';
@Injectable()
export class TotalOrder {
    constructor(private _apiService: ApiService) { }
    getTotalOrder(data) {
        let apiservice = this._apiService;
        return new Promise<TotalOrderDataType>(function(resolve, reject) {
            apiservice.api("order/totalorder", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
