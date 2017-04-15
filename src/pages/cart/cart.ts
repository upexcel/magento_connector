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
import { LoginPage } from './../login/login';
import { Events } from 'ionic-angular';
import forEach from 'lodash/forEach';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
    selector: 'cart',
    templateUrl: 'cart.html'
})
export class CartPage implements OnInit {
    res: any = [];
    lists: any = [];
    entery: boolean = false;
    totalPay: number;
    couponCode: string;
    data = {};
    couponCodeSpin: boolean = false;
    currency_sign;
    totalPrice: number = 0;
    discount: number = 0;
    tax: number = 0;
    grandtotalPrice: number = 0;
    constructor(public _events: Events, private _appConfigService: AppDataConfigService, private _toast: ToastService, public _actionSheetCtrl: ActionSheetController, private _cartFunction: CartFunction, public local: Storage, public _navCtrl: NavController, public navParams: NavParams, public _viewCtrl: ViewController) { }
    ngOnInit() {

        this.res = this._cartFunction.getCart();
        this.createData(this.res)
    }
    createData(cartData) {
        console.log("coll")
        this.totalPrice = 0;
        this.discount = 0;
        this.grandtotalPrice = 0;
        let products: any = {};
        if (cartData && cartData.length > 0) {
            forEach(cartData, (value, key) => {
                value['subTotal'] = ((parseFloat(value.total)) * (parseFloat(value.qty)));
                this.currency_sign = value.currency_sign;
                this.totalPrice += parseFloat(value.product_subtotal);
                value.info_buyRequest['info_buyRequest']['product_id'] = value.info_buyRequest['info_buyRequest']['product'];
                products[key] = value.info_buyRequest['info_buyRequest'];
            })
            this.data['products'] = products;
        }
        this.grandtotalPrice = this.totalPrice + this.discount + this.tax;
        console.log("cart data", this.totalPrice, this.grandtotalPrice)
    }
    ionViewWillEnter() {
        this._events.publish('check:login', true);
    }

    changeQuantity(data) {
        let cartData = {}
        let qty = {};
        qty[data.product_id] = {};
        qty[data.product_id]['qty'] = data.product_qty;
        cartData['update_cart'] = qty;
        this._cartFunction.updateCart(cartData).then((res) => {
            this.res = this._cartFunction.getCart();
            this.createData(this.res)
        })
    }

    deleteProduct(data) {
        console.log("data delete", data['product_id'])
        let actionSheet = this._actionSheetCtrl.create({
            title: 'Are you sure you want to remove ' + data.product_name,
            buttons: [{
                text: 'Yes',
                handler: () => {
                    this._cartFunction.deleteItem({ "product_id": data['product_id'] }).then((res) => {
                        this.res = this._cartFunction.getCart();
                        this.createData(this.res)
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
        data['type'] = data['product_type'];
        this._navCtrl.push(ProductPage, { 'id': data['product_sku'], "editCartData": data.info_buyRequest['info_buyRequest'] }).then(() => {
            const index = this._viewCtrl.index;
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
                if (this.res && this.res.length > 0) {
                    this._navCtrl.push(Checkout, { res: this.res });
                } else {
                    this._toast.toast("No product in cart. Please add first.", 3000);
                }
            } else {
                this._navCtrl.push(LoginPage, { checkoutLogin: true, res: this.res });
                //                this._toast.toast("Please Login First !!", 3000);
            }
        })
    }
    applyCoupon(couponCode) {
        if (couponCode && couponCode.trim().length > 0) {
            this.couponCodeSpin = true;
            this.data['couponcode'] = couponCode.trim();
            this._cartFunction.applyCoupon(this.data).then((res) => {
                this.discount = res.body['discount'];
                this.grandtotalPrice = res.body['grandtotal'];
                this.tax = res.body['tax'];
                this.totalPrice = res.body['subtotal_without_discount'];
                this.couponCodeSpin = false;
                this._toast.toast('Coupon Applied', 3000);
            }, (err) => {
                this._toast.toast(JSON.parse(err._body).message, 3000);
                this.couponCodeSpin = false;
                this.couponCode = '';
            })
        } else {
            this._toast.toast('enter a valid coupon code', 3000);
        }
    }
}
