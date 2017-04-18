import {Injectable, OnInit} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import {productDataType} from './productDataType';
import {ProductReviewDataType} from './productReviewDataType';
import {SubmitReviewDataType} from './submitReview';
import {GetRating} from './getRatingDataType';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
declare let Promise: any;
@Injectable()
export class Product implements OnInit {
    constructor(private _dataConfigService: AppDataConfigService, private _apiService: ApiService) {}
    ngOnInit() {}
    getProduct(data): Promise<productDataType> {
        let apiservice = this._apiService;
        return new Promise((resolve, reject)=> {
            var serviceData = this._dataConfigService.checkDataInService(data);
            if (serviceData) {
                resolve(serviceData);
            } else {
                apiservice.api("product/get/", data).subscribe((res) => {
                    this._dataConfigService.saveDataInService(data, res);
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            }
        });
    }
    getProductReview(data): Promise<ProductReviewDataType> {
        let apiservice = this._apiService;
        return new Promise(function (resolve, reject) {
            apiservice.api("product/review", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    getSubmitReview(data): Promise<SubmitReviewDataType> {
        let apiservice = this._apiService;
        return new Promise(function (resolve, reject) {
            apiservice.api("product/submitreview", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    getReview(data): Promise<GetRating> {
        let apiservice = this._apiService;
        return new Promise(function (resolve, reject) {
            apiservice.api("product/getrating", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
