import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CartFunction } from '../../model/cart/cartHandling';
import { ProductPage } from './../product/product';
import { HomePage } from './../home/home';
import { ActionSheetController } from 'ionic-angular';
import { Checkout } from './../checkOut/checkout';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';
import { ToastService } from './../../providers/toast-service/toastService';

@Component({
    selector: 'cart',
    templateUrl: 'cart.html'
})
export class CartPage implements OnInit {
    res: any = [];
    lists: any = [];
    entery: boolean = false;
    totalPay: number;
    constructor(private _appConfigService: AppDataConfigService, private _toast: ToastService, public _actionSheetCtrl: ActionSheetController, private _cartFunction: CartFunction, public local: Storage, public _navCtrl: NavController, public navParams: NavParams, public _viewCtrl: ViewController, ) { }
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
        let actionSheet = this._actionSheetCtrl.create({
            title: 'Delete',
            buttons: [{
                text: 'Yes',
                handler: () => {
                    console.log('Archive clicked');
                    this._cartFunction.deleteItem(data).then((res) => {
                        this.res = res;
                    });
                }
            }, {
                text: 'No',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }
            ]
        });
        actionSheet.present();
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
        if (typeof data['value'] == 'object') {
            return data['value'].default_title;
        } else {
            if (data['type'] == "date_time") {
                let dateObj = new Date(data['value']);
                return (dateObj.getDate() + "-" + (dateObj.getMonth() * 1 + 1) + "-" + dateObj.getFullYear() + "" + " " + dateObj.getUTCHours() + ":" + dateObj.getUTCMinutes())
            } else {
                return data['value'];
            }
        }
    }
    c_Shopping() {
        this._navCtrl.setRoot(HomePage);
    }
    placeOrder() {
        this._appConfigService.getUserData().then((userData: any) => {
            if (userData) {
                this._navCtrl.push(Checkout, { res: this.res });
            } else {
                this._toast.toast("Please Login First !!", 3000);
            }
        })
    }
}
