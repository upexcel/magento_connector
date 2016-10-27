import { Injectable, OnInit} from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import { CategoryProductDataType } from './categoryProductData';
@Injectable()
export class CategoryProduct {
    constructor(private _apiService: ApiService) { }
    getCategoryProduct(data) {
        let apiservice = this._apiService;
        return new Promise<CategoryProductDataType>(function(resolve, reject) {
            apiservice.api("category/products/", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
