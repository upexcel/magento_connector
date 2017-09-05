import {Injectable} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import {TotalOrderDataType} from './totalOrderDataType';
import {OrderListDataType} from './orderlistDatatype'
@Injectable()
export class TotalOrder {

    constructor(private _apiService: ApiService) {}
    /*getTotalOrd  
     *  call order/totalorder api
     **/
    getTotalOrder(data): Promise<TotalOrderDataType> {
        return new Promise((resolve, reject) => {
            this._apiService.api("order/totalorder", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }

    /**
    *getOrderList
    * call order/alllist api
    **/
    getOrderList(data): Promise<OrderListDataType> {
        return new Promise((resolve, reject) => {
            this._apiService.api("order/alllist", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
