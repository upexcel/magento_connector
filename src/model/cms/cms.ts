import { Injectable, OnInit } from '@angular/core';
import { ApiService } from './../../providers/api-service/api-service';
declare let Promise: any;
import { Storage } from '@ionic/storage';

@Injectable()
export class CMS implements OnInit {
    response: any;
    constructor(public local: Storage, private _apiService: ApiService) { }
    ngOnInit() { }
    getAboutUsInfo(data) {
        return new Promise((resolve, reject) => {
            this.local.get('aboutUsInfo').then((aboutUsInfo: string) => {
                if (aboutUsInfo != null && aboutUsInfo != undefined) {
                    resolve(aboutUsInfo);
                }
                else {
                    this._apiService.api("/cart/cart", data).subscribe((res: any) => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
                }
            });
        });
    }
    getContactUsInfo(data) {
        return new Promise((resolve, reject) => {
            this.local.get('contactUsInfo').then((contactUsInfo: string) => {
                if (contactUsInfo != null && contactUsInfo != undefined) {
                    resolve(contactUsInfo);
                }
                else {
                    this._apiService.api("/cart/cart", data).subscribe((res: any) => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
                }
            });
        });
    }
    getPrivacyInfo(data) {
        return new Promise((resolve, reject) => {
            this.local.get('privacyInfo').then((privacyInfo: string) => {
                if (privacyInfo != null && privacyInfo != undefined) {
                    resolve(privacyInfo);
                }
                else {
                    this._apiService.api("/cart/cart", data).subscribe((res: any) => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
                }
            });
        });
    }
}
