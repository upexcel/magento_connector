import { Injectable, OnInit } from '@angular/core';
import { ApiService } from './../../providers/api-service/api-service';
declare let Promise: any;
import { Storage } from '@ionic/storage';

@Injectable()
export class CMS implements OnInit {
    constructor(public local: Storage, private _apiService: ApiService) { }
    ngOnInit() { }
    getAboutUsInfo(data) {
        return new Promise((resolve, reject) => {
            this.local.get('aboutUsInfo1').then((aboutUsInfo: string) => {
                if (aboutUsInfo != null && aboutUsInfo != undefined) {
                    resolve(aboutUsInfo);
                }
                else {
                    this._apiService.api("web/getStaticPageContent", data).subscribe((res: any) => {
                        this.local.set('aboutUsInfo1', res);
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
                }
            });
        });
    }
    setContactUsInfo(data) {
        return new Promise((resolve, reject) => {
            this._apiService.api("web/contactus", data).subscribe((res: any) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    getPrivacyInfo(data) {
        return new Promise((resolve, reject) => {
            this.local.get('privacyInfo1').then((privacyInfo: string) => {
                if (privacyInfo != null && privacyInfo != undefined) {
                    resolve(privacyInfo);
                }
                else {
                    this._apiService.api("web/getStaticPageContent", data).subscribe((res: any) => {
                        this.local.set('privacyInfo1', res);
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
                }
            });
        });
    }
}
