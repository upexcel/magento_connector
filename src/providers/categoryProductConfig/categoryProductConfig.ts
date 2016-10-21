import { Injectable, OnInit} from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import { CategoryConfigDataType } from './../../pages/categoryProduct/categoryProductData';
@Injectable()
export class CategoryProductConfig {
    constructor(private _apiService: ApiService) { }
    getCategoryProductConfig(data) {
        let apiservice = this._apiService;
        return new Promise<CategoryConfigDataType>(function(resolve, reject) {
            apiservice.api("category/products/", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
