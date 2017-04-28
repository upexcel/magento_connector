import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';
import { ApiService } from './../../providers/api-service/api-service';
import { shippingDataType } from './shippingData';
import { paymentDataType } from './paymentData';
import { TaxDataType } from './taxData';
declare let Promise: any;
@Injectable()

export class checkoutService {
    constructor(private _appConfigService: AppDataConfigService, private _local: Storage, private _apiService: ApiService) { }
    getShippingMethods(data): Promise<shippingDataType> {
        return new Promise((resolve, reject) => {
            this._apiService.api("cart/getShippingMethods/", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    updateStripePayment(data) {
        return new Promise((resolve, reject) => {
            this._apiService.api("order/updateStripePayment", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    getPaymentMethods(): Promise<paymentDataType> {
        return new Promise((resolve, reject) => {
            this._apiService.api("cart/getPaymentMethods/", {}).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    orderPlace(data) {
        return new Promise((resolve, reject) => {
            this._apiService.api("onepage/placeOrder", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    getTaxDetail(data): Promise<TaxDataType> {
        return new Promise((resolve, reject) => {
            this._apiService.api("cart/getTaxAmount", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}