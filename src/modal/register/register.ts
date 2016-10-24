import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import { Storage } from '@ionic/storage';
declare let Promise: any;
@Injectable()
export class Register implements OnInit {
    constructor(public local: Storage, private _apiService: ApiService) { }
    ngOnInit() { }

    getRegister(data) {
        let local = this.local;
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api("customer/register/", data).subscribe((res) => {
                local.set('register_customer', res);
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
} 