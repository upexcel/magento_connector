import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import {CategorylistConfigDataType  } from './../../pages/home/categorylistconfigDataType';
import { Storage } from '@ionic/storage';
import keys from 'lodash/keys';
declare let Promise: any;
@Injectable()
export class CategorylistConfig implements OnInit {
    constructor(public local: Storage, private _apiService: ApiService) { }
    ngOnInit() { }

    getAppConfig(data): Promise<CategorylistConfigDataType> {
        let local = this.local;
        let apiservice = this._apiService;

        return new Promise(function(resolve, reject) {
            local.get('categorylist').then((categorylist: string) => {
                if (keys(categorylist).length > 0) {
                    resolve(categorylist);
                }
                else {
                        apiservice.api("category/categorylist/", data).subscribe((res) => {
                            local.set('categorylist', res);
                            resolve(data);
                        }, (err) => {
                            reject(err);
                        });
                }
            });
        });
    }
}
