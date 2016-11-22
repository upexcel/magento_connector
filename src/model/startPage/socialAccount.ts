import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import { SocialAccountDataType  } from './../../pages/startpage/socialAccountDataType';
declare let Promise: any;
@Injectable()
export class SocialAccount implements OnInit {
    constructor(private _apiService: ApiService) { }
    ngOnInit() { }
    getSocialAccount(data): Promise<SocialAccount> {
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api("customer/social_account", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}

