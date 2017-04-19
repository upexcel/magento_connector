import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import {ChangePwdDataType  } from './changePwdDataType';
declare let Promise: any;
@Injectable()
export class ChangePwd implements OnInit {
    constructor( private _apiService: ApiService) { }
    ngOnInit() { }
    getPwd(data): Promise<ChangePwdDataType> {
        return new Promise((resolve, reject)=> {
            this._apiService.api("account/changepassword/", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
