import { Injectable, OnInit} from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import { CategoryProductDataType } from './categoryProductData';
declare let Promise: any;
@Injectable()
export class CategoryProduct {
    constructor(private _apiService: ApiService) { }
    getCategoryProduct(data): Promise<CategoryProductDataType> {
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api("category/products/", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
