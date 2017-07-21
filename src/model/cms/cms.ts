import {Injectable, OnInit} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
declare let Promise: any;
import {Storage} from '@ionic/storage';

@Injectable()
export class CMS implements OnInit {
    constructor(public local: Storage, private _apiService: ApiService) {}
    ngOnInit() {}
    /**
    *getStaticPageList
    *use to call web/getStaticPageList api if not in local
    **/
    getStaticPageList() {
        return new Promise((resolve, reject) => {
            this.local.get('getStaticPageList').then((getStaticPageList) => {
                if (getStaticPageList != null && getStaticPageList != undefined) {
                    resolve(getStaticPageList);
                }
                else {
                    this._apiService.api("web/getStaticPageList", {}).subscribe((res: any) => {
                        this.local.set('getStaticPageList', res);
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
                }
            });
        });
    }
    /**
    *getStaticPageData
    *use for call web/getStaticPageContent api
    **/
    getStaticPageData(data) {
        return new Promise((resolve, reject) => {
            this._apiService.api("web/getStaticPageContent", data).subscribe((res: any) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    /**
    *setContactUsInfo
    *use for call web/contactus api
    **/
    setContactUsInfo(data) {
        return new Promise((resolve, reject) => {
            this._apiService.api("web/contactus", data).subscribe((res: any) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
