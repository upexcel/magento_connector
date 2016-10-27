import { Injectable}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import {TotalOrderDataType  } from './totalOrderDataType';
import {OrderListDataType} from './orderlistDatatype'
@Injectable()
export class TotalOrder {
    constructor(private _apiService: ApiService) { }
    getTotalOrder(data):Promise<TotalOrderDataType>{
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api("order/totalorder", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    getOrderList(data):Promise<OrderListDataType>{
      let apiservice = this._apiService;
      return new Promise(function(resolve, reject) {
          apiservice.api("order/alllist", data).subscribe((res) => {
              resolve(res);
          }, (err) => {
              reject(err);
          });
      });
    }
}
