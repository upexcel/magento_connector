import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import {TotalOrderDataType  } from './../../pages/orderList/totalOrderDataType';
declare let Promise: any;
@Injectable()
export class TotalOrder implements OnInit {
    constructor(private _apiService: ApiService) { }
    ngOnInit() { }
    getTotalOrder(data): Promise<TotalOrderDataType> {
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api("order/totalorder", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
