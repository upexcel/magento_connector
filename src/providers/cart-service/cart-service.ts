import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import forEach from 'lodash/forEach';
declare let Promise: any;
@Injectable()

export class CartService {
    constructor(private _local: Storage) {
    }
    addCart(data, keyGrop): any {
        return this._local.get('CartData').then((value: any) => {
            let count = 0;
            let keyDataCheck: boolean = false;
            let cartData: any = [];
            cartData = value;
            if (value) {
                //local/cartdata is not null
                if (value && cartData.length > 0) {
                    //iterate cartdata and if ned aded item has same id and size
                    forEach(cartData, function(value, key) {
                        keyDataCheck = true;
                        //increse count in cartitem for that item only
                        if (data.type == "configurable") {
                            for (let i = 0; i < keyGrop.length; i++) {
                                let keyNo = keyGrop[i];
                                if (value[keyNo] != "undefined") {
                                    if (data.id == value.id && data[keyNo] == value[keyNo]) {
                                        keyDataCheck = true && keyDataCheck;
                                    }
                                    else {
                                        keyDataCheck = false && keyDataCheck;
                                    }
                                }
                            }
                            if (keyDataCheck == true) {
                                value.quantity = value.quantity + data.quantity;
                                count = 1;
                            }
                        }
                        else if (data.type != "configurable") {
                            if (data.id == value.id && data.type == value.type) {
                                value.quantity = value.quantity + data.quantity;
                                count = 1;
                            }
                            //else push has new item 
                            else {
                            }
                        }
                    });
                    if (count != 1) {
                        cartData.unshift(data);
                    }
                    else {
                    }
                }
                //            //if local is set to null
                else {
                    cartData.unshift(data);
                }
            }
            //        //if no pre saved data
            else {
                cartData = [];
                cartData.unshift(data);
            }
            if (cartData != "undefined") {
                this._local.set('CartData', cartData);
                return new Promise((resolve: any, reject: any) => resolve(cartData));
            }
        });
    }
}