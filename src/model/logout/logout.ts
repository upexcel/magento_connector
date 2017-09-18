import {Injectable, OnInit} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
declare let Promise: any;
@Injectable()
export class LOGOUT implements OnInit {
    constructor(private _apiService: ApiService) {}
    ngOnInit() {}
    /**
    *getLogout
    * call customer/logout/ api
    **/
    getLogout(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._apiService.api('customer/logout/',{}).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
} 