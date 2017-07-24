import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {ApiService} from './../../providers/api-service/api-service';
@Injectable()

export class categoryService {
    constructor(private _local: Storage, private _apiService: ApiService) {}
    /**
    *getCategoryList function call category/categorylist/ api
    **/
    getCategoryList() {
        return new Promise((resolve, reject) => {
            let data = {"parent_id": "1", "type": "full"}
            this._apiService.api("category/categorylist/", data).subscribe((res) => {
                this._local.set('categorylist', res);
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}