import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import 'rxjs/add/operator/toPromise';
import forEach from 'lodash/forEach';
import isEqual from 'lodash/isEqual';
import {Cart} from '../../model/product/cart';
import {ToastService} from './../../providers/toast-service/toastService';
declare let Promise: any;
@Injectable()

export class CartService {
    constructor(private _local: Storage, private _cart: Cart, private _toast: ToastService) {
    }
    addCart(data) {
        return new Promise((resolve, reject) => {
            this._cart.getCart(data).then((res) => {
                if (res) {
                    console.log(res);
                    this.saveCartInLocal(data);
                    resolve(res);
                }
            }).catch((err) => {
                this._toast.toast(err, 3000, "top");
                resolve(err);
            });
        });
    }
    saveCartInLocal(data): any {
        let flag = 0;
        console.log("data", data);
        this._local.get('CartData').then((value: any) => {
            if (!value || value.length == 0) {
                delete data.access_token;
                delete data.secret;
                delete data.disable;
                this._local.set('CartData', [data]);
            } else {
                forEach(value, (valueData, key) => {
                    let dataQty = data.qty;
                    let valueDataQty = valueData.qty;
                    delete data.access_token;
                    delete data.secret;
                    delete data.disable;
                    delete data.qty;
                    delete valueData.qty;
                    if (isEqual(data, valueData)) {
                        valueData['qty'] = (valueDataQty * 1) + (dataQty * 1);
                        flag = 1;
                    } else {
                        valueData['qty'] = (valueDataQty * 1);
                    }
                    data.qty = dataQty;
                });
                if (flag == 1) {
                    this._local.set('CartData', value);
                } else {
                    value.unshift(data);
                    this._local.set('CartData', value);
                }
            }
            console.log("valueCart", value);
        });
    }
}