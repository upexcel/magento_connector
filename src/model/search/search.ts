import {Injectable} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
@Injectable()
export class SearchModel {
    constructor(private _apiService: ApiService) {}
    /**
* getSearchProduct
*use to callproduct/productSearch/ api 
**/
    getSearchProduct(data) {
        return new Promise((resolve, reject) => {
            this._apiService.api("product/productSearch/", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
