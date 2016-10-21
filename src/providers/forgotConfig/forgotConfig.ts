import { Injectable, OnInit} from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
@Injectable()
export class ForgotConfig {
    constructor(private _apiService: ApiService) { }
    getForgotConfig(data) {
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api("customer/forgot/", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
} 