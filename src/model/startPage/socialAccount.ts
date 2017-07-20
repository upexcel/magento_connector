import {Injectable, OnInit} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import {fcmService} from './../../providers/fcm-service/fcm-service';
declare let Promise: any;
@Injectable()
export class SocialAccount implements OnInit {
    constructor(private _apiService: ApiService, private _fcmService: fcmService) {}
    ngOnInit() {}
    /**
*getSocialAccount
*use to call customer/social_account api
**/
    getSocialAccount(data) {
        return new Promise((resolve, reject) => {
            this._apiService.api("customer/social_account", data).subscribe((res) => {
                this._fcmService.saveFCMTokenOnServer();
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}

