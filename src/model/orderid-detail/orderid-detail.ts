import { Injectable}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import { OrderIdDetailDataType } from './orderid-detailData';
import { Storage } from '@ionic/storage';
declare let Promise: any;
@Injectable()
export class OrderIdDetail {
    constructor(public local: Storage, private _apiService: ApiService) { }

    getHomeProducts(data): Promise<OrderIdDetailDataType> {
        let local = this.local;
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            local.get('orderidDetail').then((orderidDetail: string) => {
                if (orderidDetail != null && orderidDetail != undefined) {
                    resolve(orderidDetail);
                }
                else {
                    apiservice.api("order/get/", data).subscribe((res) => {
                        local.set('orderidDetail', res);
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
                }
            });
        });
    }
}



