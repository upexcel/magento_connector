import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CartFunction } from '../../model/cart/cartHandling'
import { ProductPage } from './../product/product'
import { HomePage } from './../home/home'
@Component({
    templateUrl: 'cart.html'
})
export class CartPage implements OnInit {
    res: any = [];
    lists: any = [];
    entery: boolean = false;
    totalPay: number;
    constructor(private _cartFunction: CartFunction, public local: Storage, public _navCtrl: NavController, public navParams: NavParams, public _viewCtrl: ViewController, ) { }
    ngOnInit() {
        this.local.get('CartData').then((value: any) => {
            this.res = value;
            this.entery = true;
            //            this._cartFunction.totalPay(this.res).then((response) => {
            //                this.totalPay = response;
            //            });
        });
    }


    changeQuantity() {
        this._cartFunction.updateCart(this.res);
        //        this._cartFunction.totalPay(this.res).then((response) => {
        //            this.totalPay = response;
        //        });
    }

    deleteProduct(data) {
        this._cartFunction.deleteItem(data).then((res) => {
            this.res = res;
        });
    }
    edit(data) {
        this._navCtrl.push(ProductPage, { 'id': data.sku, "editCartData": data }).then(() => {
            // first we find the index of the current view controller:
            const index = this._viewCtrl.index;
            // then we remove it from the navigation stack
            this._navCtrl.remove(index);
        });
    }
    quantityPrice(total, qty) {
        return (total * 1) * (qty * 1);
    }
    checkTypeOf(data) {
        if (typeof data == 'object') {
            return data.default_title;
        } else {
            return data;
        }
    }
    c_Shopping() {
        this._navCtrl.setRoot(HomePage);
    }
}
