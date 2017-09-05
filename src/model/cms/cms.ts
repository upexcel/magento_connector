import {Injectable, OnInit} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
declare let Promise: any;
import {Storage} from '@ionic/storage';

@Injectable()
export class CMS implements OnInit {
    getStaticPageListData: any;
    constructor(public local: Storage, private _apiService: ApiService) {}
    ngOnInit() {}
    
    resetStaticPageList() {
        this.getStaticPageListData = null;
    }
    /**
    *getStaticPageList
    *use to call web/getStaticPageList api if not in local
    **/
    getStaticPageList() {
        return new Promise((resolve, reject) => {
            if (this.getStaticPageListData && this.getStaticPageListData.body) {
                resolve(this.getStaticPageListData);
            }
            else {
                this._apiService.api("web/getStaticPageList", {}).subscribe((res: any) => {
                    this.getStaticPageListData = res;
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            }
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
