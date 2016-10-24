import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import {cartDataType  } from './../../pages/product/cartDataType';
declare let Promise: any;
@Injectable()
export class Cart implements OnInit {
    constructor(private _apiService: ApiService) { }
    ngOnInit() { }
    getCart(data): Promise<cartDataType> {
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api("cart/cart", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
