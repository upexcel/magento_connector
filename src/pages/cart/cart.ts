import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CartFunction } from '../../model/cart/cartHandling'
    




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
            console.log(value);
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
        this._cartFunction.deleteItem(data).then((res)=>{
            this.res = res;
        });
    }

}
