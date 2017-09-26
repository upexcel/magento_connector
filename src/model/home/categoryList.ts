import {CategoryListDataType} from './categorylistDataType';
import {Injectable} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
@Injectable()

export class CategoryList {
    categoryList;
    constructor(private _apiService: ApiService) {}
    /**
    *getCategoryList function call category/categorylist/ api
    **/
    getCategoryList(): Promise<CategoryListDataType> {
        return new Promise((resolve, reject) => {
            let data = {"parent_id": "1", "type": "full"};
            if ((this.categoryList && !this.categoryList.body) || !this.categoryList) {
                this._apiService.api("category/categorylist/", data).subscribe((res) => {
                    this.categoryList = res;
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            } else {
                resolve(this.categoryList);
            }
        });
    }
    resetCategoryList() {
        this.categoryList = null;
    }

    getId() {
        return new Promise((resolve, reject) => {
            if (this.categoryList && this.categoryList.body.children[0]) {
                console.log("this.categoryList",this.categoryList);
                resolve(this.categoryList.body.children[0].children[0].id);
            } else {
                this.getCategoryList().then((res) => {
                    console.log("this.categoryList",res);
                    resolve(res.body.children[0].children[0].id);
                })
            }
        })
    }
}