import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import { LoginDataType } from './../../pages/login/loginDataType';
import { fcmService } from './../../providers/fcm-service/fcm-service';
declare let Promise: any;
@Injectable()
export class Login implements OnInit {
    constructor( private _apiService: ApiService, private _fcmService:fcmService) { }
    ngOnInit() { }

    getLogin(data): Promise<LoginDataType>{
        return new Promise((resolve, reject)=> {
            this._apiService.api('customer/login/', data).subscribe((res) => {
                this._fcmService.saveFCMTokenOnServer();
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
} 