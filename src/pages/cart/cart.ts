import { Component, OnInit} from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import forEach from 'lodash/forEach';
import uniq from 'lodash/uniq';
import keys from 'lodash/keys';
import findIndex from 'lodash/findIndex';
import difference from 'lodash/difference';
import pullAll from 'lodash/pullAll';

@Component({
    templateUrl: 'cart.html'
})
export class CartPage implements OnInit {
    res: any = [];
    lists: any = [];
    entery: boolean = false;
    constructor(public local: Storage, public navCtrl: NavController, public navParams: NavParams) { }
    ngOnInit() {
        this.local.get('item').then((value: any) => {
            this.res = JSON.parse(value);
            let tempObj = [];
            forEach(this.res, function(value, key) {
                forEach(value, function(value1, key) {
                    tempObj.push(key);
                });
            });
            this.lists = uniq(pullAll(tempObj, ['id', 'name', 'img', 'price', 'type', 'quantity']));
            this.entery = true;
        });
    }

    add(data) {
        this.local.get('item').then((value: any) => {
            let cartData: any = [];
            let UpdatecartData = [];
            let keyDataCheck: boolean = false;
            cartData = JSON.parse(value);
            data.quantity++;
            if (data.type == "configurable") {
                let keyGrop = uniq(pullAll(keys(data), ['id', 'name', 'img', 'price', 'type', 'quantity']));
                forEach(cartData, function(value, key) {
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
                this.local.set('item', JSON.stringify(UpdatecartData));
            }


            else {

                forEach(cartData, function(value, key) {
                    //push has new item 
                    if (data.id == value.id && data.type == value.type) {
                        UpdatecartData.push(data);
                    }
                    //else push has old item 
                    else {
                        UpdatecartData.push(value);
                    }
                });
                this.local.set('item', JSON.stringify(UpdatecartData));


            }
        });
    }
    remove(data) {
        this.local.get('item').then((value: any) => {
            let cartData = [];
            let UpdatecartData = [];
            let keyDataCheck: boolean = false;
            cartData = JSON.parse(value);
            data.quantity--;
            if (data.type == "configurable") {
                let keyGrop = uniq(pullAll(keys(data), ['id', 'name', 'img', 'price', 'type', 'quantity']));
                forEach(cartData, function(value, key) {
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
                this.local.set('item', JSON.stringify(UpdatecartData));
            }


            else {

                forEach(cartData, function(value, key) {
                    //push has new item 
                    if (data.id == value.id && data.type == value.type) {
                        UpdatecartData.push(data);
                    }
                    //else push has old item 
                    else {
                        UpdatecartData.push(value);
                    }
                });
                this.local.set('item', JSON.stringify(UpdatecartData));


            }
        });
    }

    delete(data) {
        let cartData = [];
        let tempObj = [];
        let dataloc = [];
        let key = [];
        let allKey = [];
        let iterate: any = [];
        let data1 = [];
        let val;
        this.local.get('item').then((value: any) => {
            val = JSON.parse(value);
            let output;
            let r = {};

            if (data.type == "configurable") {
                let dubData = data;
                key = uniq(pullAll(keys(dubData), ['id', 'name', 'img', 'price', 'type', 'quantity']));

                allKey = uniq(pullAll(keys(data), ['name', 'img', 'price', 'quantity']));
                for (var i = 0; i < allKey.length; i++) {
                    var keys = allKey[i];
                    iterate.push(data[keys]);
                }
                for (i = 0; i < keys.length; i++) {
                    r[allKey[i]] = iterate[i];
                };
                let f = findIndex(val, r);
                output = difference(val, val.splice(f, 1));
                this.local.set('item', JSON.stringify(output));
                this.res = output;
            }
            else {
                let f = findIndex(val, { 'id': data.id, 'type': data.type });
                output = difference(val, val.splice(f, 1));
                this.local.set('item', JSON.stringify(output));
                this.res = output;
            }
        });
    }
}  