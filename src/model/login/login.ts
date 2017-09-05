import {Injectable, OnInit} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import {LoginDataType} from './loginDataType';
declare let Promise: any;
@Injectable()
export class Login implements OnInit {
    constructor(private _apiService: ApiService) {}
    ngOnInit() {}
    /**
    *getLogin
    * call customer/login/ api
    **/
    getLogin(data): Promise<LoginDataType> {
        return new Promise((resolve, reject) => {
            this._apiService.api('customer/login', data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
} 