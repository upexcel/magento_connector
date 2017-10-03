import {CategoryListDataType} from './categorylistDataType';
import {Injectable} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import {Storage} from '@ionic/storage';

@Injectable()

export class CategoryList {
    constructor(public local: Storage, private _apiService: ApiService) {}
    /**
    *getCategoryList function call category/categorylist/ api
    **/
    getCategoryList(): Promise<CategoryListDataType> {
        return new Promise((resolve, reject) => {
            let data = {"parent_id": "1", "type": "full"};
            this.local.get('categoryList').then((categoryList) => {
                if ((categoryList && !categoryList.body) || !categoryList) {
                    this._apiService.api("category/categorylist/", data).subscribe((res) => {
                        this.local.set('categoryList', res);
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
                } else {
                    resolve(categoryList);
                }
            });
        })
    }
    resetCategoryList() {
        this.local.remove('categoryList');
    }

    getId() {
        return new Promise((resolve, reject) => {
            this.local.get('categoryList').then((categoryList) => {
                if (categoryList && categoryList.body.children[0]) {
                    resolve(categoryList.body.children[0].children[0].id);
                } else {
                    this.getCategoryList().then((res) => {
                        resolve(res.body.children[0].children[0].id);
                    })
                }
            })
        });
    }
}