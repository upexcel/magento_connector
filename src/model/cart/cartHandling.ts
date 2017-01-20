import { Injectable, OnInit } from '@angular/core';
import { ApiService } from './../../providers/api-service/api-service';
import forEach from 'lodash/forEach';
import uniq from 'lodash/uniq';
import keys from 'lodash/keys';
import findIndex from 'lodash/findIndex';
import difference from 'lodash/difference';
import pullAll from 'lodash/pullAll';
import { Storage } from '@ionic/storage';
import _ from 'lodash';

declare let Promise: any;
@Injectable()
export class CartFunction implements OnInit {
    constructor(public local: Storage) { }
    ngOnInit() { }
    addItem(newQuantity, data) {
        this.local.get('CartData').then((value: any) => {
            let CartData: any = [];
            let UpdatecartData = [];
            let keyDataCheck: boolean = false;
            CartData = value;
            if (data.type == "configurable") {
                let keyGrop = uniq(pullAll(_.keys(data), ['id', 'name', 'img', 'price', 'type', 'quantity']));
                forEach(CartData, function(value, key) {
                    keyDataCheck = true;
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
                        UpdatecartData.push(data);;

                    }
                    else {
                        UpdatecartData.push(value);
                    }

                });
                this.local.set('CartData', UpdatecartData);
            }
            else {
                forEach(CartData, function(value, key) {
                    //push has new item
                    if (data.id == value.id && data.type == value.type) {
                        UpdatecartData.push(data);
                    }
                    //else push has old item
                    else {
                        UpdatecartData.push(value);
                    }
                });
                this.local.set('CartData', UpdatecartData);
            }
        });
    }

    totalPay(data) {
        let totalPay: number = 0;
        forEach(data, function(value, key) {
            let pay = value['price'] * value["quantity"]
            totalPay = totalPay + pay;

        });
        return new Promise(function(resolve, reject) {
            resolve(totalPay);
        });
    }
    deleteItem(data, response) {
        let key = [];
        let allKey = [];
        let iterate: any = [];
        let val;
        val = response;
        let output;
        let r = {};

        if (data.type == "configurable") {
            allKey = uniq(pullAll(_.keys(data), ['name', 'img', 'price', 'quantity']));

            for (var i = 0; i < allKey.length; i++) {
                var keys = allKey[i];
                iterate.push(data[keys]);
            }
            for (i = 0; i < keys.length; i++) {
                r[allKey[i]] = iterate[i];
            };
            let f = findIndex(val, r);
            output = difference(val, val.splice(f, 1));
            this.local.set('CartData', output);
            response = output;
        }
        else {
            let f = findIndex(val, { 'id': data.id, 'type': data.type });
            output = difference(val, val.splice(f, 1));
            this.local.set('CartData', output);
            response = output;
        }
        return new Promise(function(resolve, reject) {
            resolve(response);
        });
    }
}

