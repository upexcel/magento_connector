import {Injectable, OnInit} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import {CategoryListDataType} from './categorylistDataType';
import {Storage} from '@ionic/storage';
import keys from 'lodash/keys';
import {categoryService} from './../../providers/category-service/category-service';
declare let Promise: any;
@Injectable()
export class CategoryList implements OnInit {
    constructor(public local: Storage, private _apiService: ApiService, private _categoryService: categoryService) {}
    ngOnInit() {}
    /**
   *getCategoryList
   *use to  get Category product data
   **/

    getCategoryList(): Promise<CategoryListDataType> {
        let local = this.local;
        return new Promise((resolve, reject) => {
            local.get('categorylist').then((categorylist: string) => {
                if (keys(categorylist).length > 0 && categorylist !== null) {
                    resolve(categorylist);
                }
                else {
                    this._categoryService.getCategoryList().then((res) => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
                }
            });
        });
    }
}
