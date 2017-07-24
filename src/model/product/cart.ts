import {Injectable, OnInit} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import {cartDataType} from './../../pages/product/cartDataType';
declare let Promise: any;
@Injectable()
export class Cart implements OnInit {
    constructor(private _apiService: ApiService) {}
    ngOnInit() {}
    /**
    *getCart
    *use for call cart/cart api
    **/
    getCart(data): Promise<cartDataType> {
        return new Promise((resolve, reject) => {
            this._apiService.api("cart/cart", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
