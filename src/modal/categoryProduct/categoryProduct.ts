import { Injectable, OnInit} from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import { CategoryDataType } from './../../pages/categoryProduct/categoryProductData';
@Injectable()
export class CategoryProducts {
    constructor(private _apiService: ApiService) { }
    getCategoryProduct(data) {
        let apiservice = this._apiService;
        return new Promise<CategoryDataType>(function(resolve, reject) {
            apiservice.api("category/products/", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
