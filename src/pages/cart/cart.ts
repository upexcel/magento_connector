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
    constructor(private sanitizer: DomSanitizer, public _events: Events, private _appConfigService: AppDataConfigService, private _toast: ToastService, public _actionSheetCtrl: ActionSheetController, private _cartFunction: CartFunction, public local: Storage, public _navCtrl: NavController, public navParams: NavParams, public _viewCtrl: ViewController) { }
    ngOnInit() {

        let res = this._cartFunction.getCart();
        forEach(res,(value,key)=>{
           value.product_image = (value.product_image).replace(/"/g,"");
        })
        
        this.res = res;
console.log("res",this.res)

    }
    createData(cartData) {
        let products: any = {};
        this._appConfigService.getUserData().then((userData: any) => {
            this.data["secret"] = userData ? userData['secret'] : "";
            this.local.get('store_id').then((store_id: any) => {
                if (userData) {
                    this.data["store_id"] = store_id ? store_id : "";
                    if (cartData && cartData.length > 0) {
                        forEach(cartData, (value, key) => {
                            value['subTotal'] = ((parseFloat(value.total)) * (parseFloat(value.qty)));
                            this.currency_sign = value.currency_sign;
                            this.totalPrice += parseFloat(value.subTotal);
                            products = {};
                            products["product_id"] = value.productid;
                            if (value.type != "grouped") {
                                products["qty"] = value["qty"];
                                if (value.type == 'configurable' && Object.keys(value['super_attribute'])) {
                                    products["super_attribute"] = value['super_attribute'];
                                } else if (value.type == "downloadable" && Object.keys(value['links'])) {
                                    products["links"] = value['links'];
                                }
                                else if (value.type == "bundle" && Object.keys(value['bundle_option_qty'])) {
                                    products["bundle_option_qty"] = value['bundle_option_qty'];
                                    products["bundle_option"] = value['bundle_option'];
                                }
                            } else {
                                products["qty"] = 0;
                                if (Object.keys(value['super_attribute'])) {
                                    products["super_group"] = value['super_attribute'];
                                }
                            }
                            if (value['options'] && Object.keys(value['options']).length > 0) {
                                products["options"] = value['options'];
                            }
                            if (!this.data['products']) {
                                this.data['products'] = {};
                            }
                            this.data['products'][key] = products;
                        })
                    }
                    this.grandtotalPrice = this.totalPrice + this.discount + this.tax;
                }
            })
        })
    }
    trutUrl(url) {
        console.log("coll")
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    ionViewWillEnter() {
        this._events.publish('check:login', true);
    }

    changeQuantity() {
        this._cartFunction.updateCart(this.res);
        //        this._cartFunction.totalPay(this.res).then((response) => {
        //            this.totalPay = response;
        //        });
    }

    deleteProduct(data) {
        let actionSheet = this._actionSheetCtrl.create({
            title: 'Are you sure you want to remove ' + data.name,
            buttons: [{
                text: 'Yes',
                handler: () => {
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
