import {Injectable} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import {CategoryProductDataType} from './categoryProductData';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
declare let Promise: any;
@Injectable()
export class CategoryProduct {
    constructor(public _dataConfigService: AppDataConfigService, private _apiService: ApiService) {}
    getCategoryProduct(data): Promise<CategoryProductDataType> {
        let apiservice = this._apiService;
        return new Promise((resolve, reject) => {
            var serviceData = this._dataConfigService.checkDataInService(data);
            if (serviceData) {
                resolve(serviceData);
            } else {
                apiservice.api("category/products/", data).subscribe((res) => {
                    this._dataConfigService.saveDataInService(data, res);
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            }
        });
    }
}
