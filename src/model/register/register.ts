import {Injectable, OnInit} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import {Storage} from '@ionic/storage';
declare let Promise: any;
@Injectable()
export class Register implements OnInit {
    constructor(public local: Storage, private _apiService: ApiService) {}
    ngOnInit() {}
    /*
     * use for customer/register api call
     */
    getRegister(data) {
        return new Promise((resolve, reject) => {
            this._apiService.api("customer/register/", data).subscribe((res) => {
                this.local.set('register_customer', res);
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
} 