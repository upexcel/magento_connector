import { Injectable, OnInit} from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
@Injectable()
export class CategoryProductConfig {
    constructor(private _apiService: ApiService) { }
    getCategoryProductConfig(data) {
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