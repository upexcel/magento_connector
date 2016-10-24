import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import {ChangePwdDataType  } from './../../pages/changePassword/changePwdDataType';
declare let Promise: any;
@Injectable()
export class ChangePwd implements OnInit {
    constructor(public local: Storage, private _apiService: ApiService) { }
    ngOnInit() { }
    getPwd(data): Promise<ChangePwdDataType> {
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api("account/changepassword/", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
