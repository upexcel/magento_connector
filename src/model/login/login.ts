import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import { LoginDataType } from './../../pages/login/loginDataType';
declare let Promise: any;
@Injectable()
export class Login implements OnInit {
    constructor( private _apiService: ApiService) { }
    ngOnInit() { }

    getLogin(data): Promise<LoginDataType>{
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api('customer/login/', data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
} 