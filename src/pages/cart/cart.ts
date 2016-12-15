import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import forEach from 'lodash/forEach';
import { CartFunction } from '../../model/cart/cartHandling'
import uniq from 'lodash/uniq';
import keys from 'lodash/keys';
import findIndex from 'lodash/findIndex';
import difference from 'lodash/difference';
import pullAll from 'lodash/pullAll';
import _ from 'lodash';
@Component({
    templateUrl: 'cart.html'
})
export class CartPage implements OnInit {
    res: any = [];
    lists: any = [];
    entery: boolean = false;
    totalPay: number;
    constructor(private _cartFunction: CartFunction, private _events: Events, public local: Storage, public navCtrl: NavController, public navParams: NavParams) { }
    ngOnInit() {
        this.local.get('CartData').then((value: any) => {
            this.res = value;
            console.log('this response from cart page',this.res);
            let tempObj = [];
            forEach(this.res, function(value, key) {
                forEach(value, function(value1, key) {
                    tempObj.push(key);
                });
            });
            this.lists = uniq(pullAll(tempObj, ['id', 'name', 'img', 'price', 'type', 'quantity']));
            this.entery = true;
            this._cartFunction.totalPay(this.res).then((response) => {
                this.totalPay = response;
            });
        });
    }


    changeQuantity(newQuantity, data) {
        console.log('checking for data', data)
        this._cartFunction.addItem(newQuantity, data)
        this._cartFunction.totalPay(this.res).then((response) => {
            this.totalPay = response;
        });
    }


    delete(data) {
        this._cartFunction.deleteItem(data, this.res).then((response) => {
            this.res = response;
            this._cartFunction.totalPay(this.res).then((rese) => {
                this.totalPay = rese;
            });

        });
    }

}
