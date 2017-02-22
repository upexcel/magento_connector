import {Injectable, OnInit} from '@angular/core';
import forEach from 'lodash/forEach';
import uniq from 'lodash/uniq';
import findIndex from 'lodash/findIndex';
import difference from 'lodash/difference';
import pullAll from 'lodash/pullAll';
import {Storage} from '@ionic/storage';
import _ from 'lodash';

declare let Promise: any;
@Injectable()
export class CartFunction implements OnInit {
    constructor(public local: Storage) {}
    ngOnInit() {}
    addItem(newQuantity, data) {
        //        this.local.get('CartData').then((value: any) => {
        //            let CartData: any = [];
        //            let UpdatecartData = [];
        //            let keyDataCheck: boolean = false;
        //            CartData = value;
        //            if (data.type == "configurable") {
        //                let keyGrop = uniq(pullAll(_.keys(data), ['id', 'name', 'img', 'price', 'type', 'quantity']));
        //                forEach(CartData, function(value, key) {
        //                    keyDataCheck = true;
        //                    for (let i = 0; i < keyGrop.length; i++) {
        //                        let keyNo = keyGrop[i];
        //                        if (value[keyNo] != "undefined") {
        //                            if (data.id == value.id && data[keyNo] == value[keyNo]) {
        //                                keyDataCheck = true && keyDataCheck;
        //                            }
        //                            else {
        //                                keyDataCheck = false && keyDataCheck;
        //                            }
        //                        }
        //                    }
        //                    if (keyDataCheck == true) {
        //                        UpdatecartData.push(data);;
        //
        //                    }
        //                    else {
        //                        UpdatecartData.push(value);
        //                    }
        //
        //                });
        //                this.local.set('CartData', UpdatecartData);
        //            }
        //            else {
        //                forEach(CartData, function(value, key) {
        //                    //push has new item
        //                    if (data.id == value.id && data.type == value.type) {
        //                        UpdatecartData.push(data);
        //                    }
        //                    //else push has old item
        //                    else {
        //                        UpdatecartData.push(value);
        //                    }
        //                });
        //                this.local.set('CartData', UpdatecartData);
        //            }
        //        });
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
            });
        });
    }
    updateCart(newCartData){
        this.local.set('CartData', newCartData);
    }
}

