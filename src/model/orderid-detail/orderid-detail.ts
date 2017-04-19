import {Injectable} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import {OrderIdDetailDataType} from './orderid-detailData';
import {Storage} from '@ionic/storage';
declare let Promise: any;
@Injectable()
export class OrderIdDetail {
    constructor(public local: Storage, private _apiService: ApiService) {}

    getHomeProducts(data): Promise<OrderIdDetailDataType> {
        return new Promise((resolve, reject) => {
            this._apiService.api("order/get/", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
