import {Injectable, OnInit} from '@angular/core';
import forEach from 'lodash/forEach';
import findIndex from 'lodash/findIndex';
import {Storage} from '@ionic/storage';
import {Events} from 'ionic-angular';
import {ApiService} from './../../providers/api-service/api-service';

declare let Promise: any;
@Injectable()
export class CartFunction implements OnInit {
    constructor(private _events: Events, public local: Storage, private _apiService: ApiService) {}
    ngOnInit() {}
    addItem(newQuantity, data) {
    }

    totalPay(data) {
        let totalPay: number = 0;
        forEach(data, function (value, key) {
            let pay = value['price'] * value["quantity"]
            totalPay = totalPay + pay;

        });
        return new Promise(function (resolve, reject) {
            resolve(totalPay);
        });
    }
    deleteItem(deletingItemData) {
        return new Promise((resolve, reject) => {
            this.local.get('CartData').then((CartData: any) => {
                let index = findIndex(CartData, deletingItemData);
                if (index >= 0) {
                    CartData.splice(index, 1)
                }
                this.local.set('CartData', CartData);
                resolve(CartData);
                this._events.publish('cartItems:length', CartData.length);
            });
        });
    }
    updateCart(newCartData) {
        forEach(newCartData, (value) => {
            if (!value.qty) {
                value.qty = 1;
            }
        })

        this._events.publish('cartItems:length', newCartData.length);
        this.local.set('CartData', newCartData);
    }
    applyCoupon(data) {
        return new Promise((resolve, reject) => {
            this._apiService.api("cart/coupon", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}

