import {
    Injectable
} from '@angular/core';
import {
    Storage
} from '@ionic/storage';
import {ApiService } from './../../providers/api-service/api-service';
import {CategoryListDataType  } from './../../pages/home/categorylistDataType';

@Injectable()

export class categoryService {
    constructor(private _local: Storage, private _apiService: ApiService) {}
    getCategoryList(): Promise<CategoryListDataType> {
        return new Promise((resolve, reject)=> {
            this._local.get('store_id').then((store_id: any) => {
                let data = { "parent_id": "1", "type": "full", "store_id": store_id }
                this._apiService.api("category/categorylist/", data).subscribe((res) => {
                    this._local.set('categorylist', res);
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            });
        });
    }
}