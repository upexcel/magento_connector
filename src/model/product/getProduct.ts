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
    /**
   * getProduct
   *use for call product/get/ api 
   **/
    getProduct(data): Promise<productDataType> {
        let apiservice = this._apiService;
        return new Promise((resolve, reject) => {
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
    /**
    * getProductReview
    *use for call product/review api 
    **/
    getProductReview(data): Promise<ProductReviewDataType> {
        return new Promise((resolve, reject) => {
            this._apiService.api("product/review", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    /**
   * getSubmitReview
   *use for call product/submitreview api 
   **/
    getSubmitReview(data): Promise<SubmitReviewDataType> {
        return new Promise((resolve, reject) => {
            this._apiService.api("product/submitreview", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    /**
   * getReview
   *use for call product/getrating api 
   **/
    getReview(data): Promise<GetRating> {
        return new Promise((resolve, reject) => {
            this._apiService.api("product/getrating", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
