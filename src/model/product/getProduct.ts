import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import { productDataType  } from './../../pages/product/productDataType';
import { ProductReviewDataType } from './productReviewDataType';
import { SubmitReviewDataType } from './submitReview';
import { GetRating } from './getRatingDataType';
declare let Promise: any;
@Injectable()
export class Product implements OnInit {
    constructor(private _apiService: ApiService) { }
    ngOnInit() { }
    getProduct(data): Promise<productDataType> {
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api("product/get/", data).subscribe((res) => {
                console.log("ksdbnfk");
                resolve(res);
            }, (err) => {
              console.log("edsf");
                reject(err);
            });
        });
    }
    getProductReview(data): Promise<ProductReviewDataType> {
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api("product/review", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    getSubmitReview(data): Promise<SubmitReviewDataType> {
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api("product/submitreview", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    getReview(data): Promise<GetRating> {
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api("product/getrating", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
