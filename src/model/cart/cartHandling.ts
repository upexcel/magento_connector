import {Injectable, OnInit} from '@angular/core';
import forEach from 'lodash/forEach';
import {Storage} from '@ionic/storage';
import {Events} from 'ionic-angular';
import {ApiService} from './../../providers/api-service/api-service';
import {ToastService} from './../../providers/toast-service/toastService';

declare let Promise: any;
@Injectable()
export class CartFunction implements OnInit {
    constructor(private _toast: ToastService, private _events: Events, public local: Storage, private _apiService: ApiService) {}
    cartData: any;
    ngOnInit() {}

    totalPay(data) {
        let totalPay: number = 0;
        forEach(data, (value, key) => {
            let pay = value['price'] * value["quantity"]
            totalPay = totalPay + pay;

        });
        return new Promise((resolve, reject) => {
            resolve(totalPay);
        });
    }
    setCartData() {
        return new Promise((resolve, reject) => {
            this._apiService.api("cart/getCartItems", {}).subscribe((res) => {
                this.setCart(res['body']);
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    getCart() {
        forEach(this.cartData.cart_items, (value, key) => {
            value.product_image = (value.product_image).replace(/"/g, "");
        })
        let length = (this.cartData.cart_items) ? this.cartData.cart_items.length : this.cartData.length;
        this._events.publish('cartItems:length', length);
        return this.cartData;
    }
    setCart(data) {
        this.cartData = data;
        let length = (this.cartData.cart_items) ? this.cartData.cart_items.length : data.length;
        this._events.publish('cartItems:length', length);
    }
    deleteItem(deletingItemData) {
        return new Promise((resolve, reject) => {
            this._apiService.api("cart/deleteCartItems", deletingItemData).subscribe((res) => {
                if (res && res['body'].success) {
                    this.cartData = res['body'].updated_cart;
                    let length = (this.cartData.cart_items) ? this.cartData.cart_items.length : this.cartData.length;
                    this._events.publish('cartItems:length', length);
                } else {
                    this._toast.toast("Delete fail", 3000);

                }
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    updateCart(newCartData) {
        return new Promise((resolve, reject) => {
            this._apiService.api("cart/updateCartItems", newCartData).subscribe((res) => {
                if (res && res['body'].success) {
                    this.cartData = res['body'].success_data;
                    this._events.publish('cartItems:length', this.cartData ? this.cartData.cart_items.length : 0);
                } else {
                    this._toast.toast("update fail", 3000);
                }
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });

    }
    editCart(data) {
        return new Promise((resolve, reject) => {
            this._apiService.api("cart/updateCartItems", data).subscribe((res) => {
                if (res && res['body'].success) {
                    this.cartData = res['body'].updated_cart;
                } else {
                    this._toast.toast("edit fail", 3000);
                }
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
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

