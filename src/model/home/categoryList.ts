import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import {CategoryListDataType  } from './../../pages/home/categorylistDataType';
import { Storage } from '@ionic/storage';
import keys from 'lodash/keys';
declare let Promise: any;
@Injectable()
export class CategoryList implements OnInit {
    constructor(public local: Storage, private _apiService: ApiService) { }
    ngOnInit() { }

    getCategoryList(): Promise<CategoryListDataType> {
        let local = this.local;
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            local.get('categorylist').then((categorylist: string) => {
                if (keys(categorylist).length > 0) {
                    resolve(categorylist);
                }
                else {
                    local.get('store_id').then((store_id: any) => {
                        let data = { "parent_id": "1", "type": "full", "store_id": store_id }
                        apiservice.api("category/categorylist/", data).subscribe((res) => {
                            local.set('categorylist', res);
                            resolve(res);
                        }, (err) => {
                            reject(err);
                        });
                    });
                }
            });
        });
    }
}
