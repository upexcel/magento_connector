import {Injectable, OnInit} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import {LoginDataType} from './loginDataType';
import {fcmService} from './../../providers/fcm-service/fcm-service';
declare let Promise: any;
@Injectable()
export class Login implements OnInit {
    constructor(private _apiService: ApiService, private _fcmService: fcmService) {}
    ngOnInit() {}
    /**
    *getLogin
    * call customer/login/ api
    **/
    getLogin(data): Promise<LoginDataType> {
        console.log("login service")
        return new Promise((resolve, reject) => {
            this._apiService.api('customer/login', data).subscribe((res) => {
                console.log("login service response")
                this._fcmService.saveFCMTokenOnServer();
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
} 