import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CartFunction } from '../../model/cart/cartHandling'
import { ProductPage } from './../product/product'

@Component({
    templateUrl: 'cart.html'
})
export class CartPage implements OnInit {
    res: any = [];
    lists: any = [];
    entery: boolean = false;
    totalPay: number;
    constructor(private _cartFunction: CartFunction, public local: Storage, public _navCtrl: NavController, public navParams: NavParams) { }
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
        this._navCtrl.push(ProductPage,{'id':data.sku,"editCartData":data});
    }
    checkTypeOf(data){
        console.log(typeof data)
        if(typeof data == 'object'){
            return data.default_title;
        } else{
            return data;
        }
    }

}
