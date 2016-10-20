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
                local.set('login_customer', res);
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
} 


//            (err) => {
//                if (err.status === 0) {
//                    console.log(err)
//                    this.spin = false;
//                    this.presentToast(err.msg);
//                }
//            }
//        )  