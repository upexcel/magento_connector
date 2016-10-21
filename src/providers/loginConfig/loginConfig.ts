import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import { LoginConfigDataType } from './../../pages/login/loginConfigDataType';
import { Storage } from '@ionic/storage';
declare let Promise: any;
@Injectable()
export class LoginConfig implements OnInit {
    constructor(public local: Storage, private _apiService: ApiService) { }
    ngOnInit() { }

    getLoginConfig(data): Promise<LoginConfigDataType>{
        let local = this.local;
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