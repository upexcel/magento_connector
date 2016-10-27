import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import { productDataType  } from './../../pages/product/productDataType';
declare let Promise: any;
@Injectable()
export class Product implements OnInit {
    constructor(private _apiService: ApiService) { }
    ngOnInit() { }
    getProduct(data): Promise<productDataType> {
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api("product/get/", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
