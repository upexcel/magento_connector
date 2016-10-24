import { Injectable} from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
@Injectable()
export class Forgot {
    constructor(private _apiService: ApiService) { }
    getForgot(data) {
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