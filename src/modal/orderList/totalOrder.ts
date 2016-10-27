import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import {TotalOrderDataType  } from './../../pages/orderList/totalOrderDataType';
@Injectable()
export class TotalOrder implements OnInit {
    constructor(private _apiService: ApiService) { }
    ngOnInit() { }
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
