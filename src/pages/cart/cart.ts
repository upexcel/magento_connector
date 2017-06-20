import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CartFunction } from '../../model/cart/cartHandling';
import { ProductPage } from './../product/product';
import { HomePage } from './../home/home';
import { ActionSheetController, AlertController } from 'ionic-angular';
import { Checkout } from './../checkOut/checkout';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';
import { ToastService } from './../../providers/toast-service/toastService';
import { LoginPage } from './../login/login';
import { Events } from 'ionic-angular';
import forEach from 'lodash/forEach';
@Component({
    selector: 'cart',
    templateUrl: 'cart.html'
})
export class CartPage implements OnInit {
    res: any;
    lists: Array<any> = [];
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
    deleteCouponCodeSpin: boolean = false;
    constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController, public _events: Events, private _appConfigService: AppDataConfigService, private _toast: ToastService, public _actionSheetCtrl: ActionSheetController, private _cartFunction: CartFunction, public local: Storage, public _navCtrl: NavController, public navParams: NavParams, public _viewCtrl: ViewController) { }
    ngOnInit() {
        this.res = this._cartFunction.getCart();
        this.createData(this.res)
    }
    createData(cartData) {
        this.totalPrice = cartData.subtotal_without_discount;
        this.discount = cartData.discount;
        this.grandtotalPrice = cartData.grandtotal;
        this.tax = cartData.tax;
        this.couponCode = cartData.coupon_code;
        let products: any = {};
        if (cartData && cartData.cart_items && cartData.cart_items.length > 0) {
            forEach(cartData.cart_items, (value, key) => {
                value['vertualQty'] = value.product_qty;
                this.currency_sign = value.currency_sign;
                value.info_buyRequest['info_buyRequest']['product_id'] = value.info_buyRequest['info_buyRequest']['product'];
                products[key] = value.info_buyRequest['info_buyRequest'];
            })
            this.data['products'] = products;
        }
    }
    ionViewWillEnter() {
        this._events.publish('check:login', true);
    }

    changeQuantity(data) {
        if (data.product_qty == "More") {
            let prompt = this.alertCtrl.create({
                title: 'Enter Product Quantity',
                inputs: [
                    {
                        name: 'qty',
                        placeholder: 'quantity',
                        type: 'number'
                    },
                ],
                buttons: [
                    {
                        text: 'Cancel',
                        handler: promptData => {
                            data.product_qty = data['vertualQty'];
                        }
                    },
                    {
                        text: 'Ok',
                        handler: promptData => {
                            if (promptData.qty == '0') {
                                return false;
                            } else {
                                data.product_qty = promptData.qty;
                                data['vertualQty'] = promptData.qty;
                                let cartData = {}
                                let qty = {};
                                qty[data.product_id] = {};
                                qty[data.product_id]['qty'] = data.product_qty;
                                cartData['update_cart'] = qty;
                                let loading = this.loadingCtrl.create({
                                    content: 'Please wait...'
                                });
                                loading.present();
                                this._cartFunction.updateCart(cartData).then((res) => {
                                    this.res = this._cartFunction.getCart();
                                    this.createData(this.res);
                                    loading.dismiss();
                                }, (err) => {
                                    loading.dismiss();
                                })
                            }
                        }
                    }
                ]
            });
            prompt.present();
        } else {
            let cartData = {}
            let qty = {};
            data['vertualQty'] = data.product_qty;
            qty[data.product_id] = {};
            qty[data.product_id]['qty'] = data.product_qty;
            cartData['update_cart'] = qty;
            let loading = this.loadingCtrl.create({
                content: 'Please wait...'
            });
            loading.present();
            this._cartFunction.updateCart(cartData).then((res) => {
                this.res = this._cartFunction.getCart();
                this.createData(this.res);
                loading.dismiss();
            }, (err) => {
                loading.dismiss();

            })
        }
    }

    deleteProduct(data) {
        let actionSheet = this._actionSheetCtrl.create({
            title: 'Are you sure you want to remove ' + data.product_name,
            buttons: [{
                text: 'Yes',
                handler: () => {
                    let loading = this.loadingCtrl.create({
                        content: 'Please wait...'
                    });
                    loading.present();
                    this._cartFunction.deleteItem({ "item_id": data['item_id'] }).then((res) => {
                        this.res = this._cartFunction.getCart();
                        this.createData(this.res);
                        loading.dismiss();
                    }, (err) => {
                        loading.dismiss();
                    });
                }
            }, {
                text: 'No',
                role: 'cancel',
                handler: () => {
                }
            }
            ]
        });
        actionSheet.present();
    }
    edit(data) {
        data['type'] = data['product_type'];
        this._navCtrl.push(ProductPage, { 'id': data['product_sku'], "editCartData": data.info_buyRequest['info_buyRequest'], "item_id": data['item_id'], "quote_id": data['quote_id'], "editProductQuantity": data['product_qty'] }).then(() => {
            const index = this._viewCtrl.index;
            this._navCtrl.remove(index);
        });
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
        this._navCtrl.popToRoot();
    }
    placeOrder() {
        this._appConfigService.getUserData().then((userData: any) => {
            if (userData) {
                if (this.res && this.res.cart_items && this.res.cart_items.length > 0) {
                    this._navCtrl.push(Checkout, { res: this.res });
                } else {
                    this._toast.toast("No product in cart. Please add first.", 3000);
                }
            } else {
                this._navCtrl.push(LoginPage, { checkoutLogin: true, res: this.res });
                this._toast.toast("Please Login First !!", 3000);
            }
        })
    }
    applyCoupon(couponCode) {
        if (couponCode && couponCode.trim().length > 0) {
            if (couponCode == 'delete') {
                this.deleteCouponCodeSpin = true;
            } else {
                this.couponCodeSpin = true;
            }
            this.data['couponcode'] = couponCode.trim();
            this._cartFunction.applyCoupon(this.data).then((res:any) => {
                res=res['body'];
                this.res['subtotal_without_discount'] = res.subtotal_without_discount;
                this.res['discount'] = res.discount;
                this.res['grandtotal'] = res.grandtotal;
                this.res['tax'] = res.tax;
                this.res['shipping_amount'] = res.shipping_amount;
                this.res['subtotal_with_discount'] = res.subtotal_with_discount;
                this.discount = res['discount'];
                this.grandtotalPrice = res['grandtotal'];
                this.tax = res['tax'];
                this.totalPrice = res['subtotal_without_discount'];
                this.couponCodeSpin = false;
                this.deleteCouponCodeSpin = false;
                if (couponCode == 'delete') {
                    this._toast.toast('Coupon Removed', 3000);
                    this.couponCode = '';
                } else {
                    this._toast.toast('Coupon Applied', 3000);
                }
            }, (err) => {
                if (couponCode == 'delete') {
                    this._toast.toast('Coupon Removed', 3000);
                    this.couponCode = '';
                } else {
                    this._toast.toast(JSON.parse(err._body).message, 3000);
                }
                this.couponCodeSpin = false;
                this.deleteCouponCodeSpin = false;
                this.couponCode = '';
            })
        } else {
            this._toast.toast('enter a valid coupon code', 3000);
            this.couponCode = '';
        }
    }
}
