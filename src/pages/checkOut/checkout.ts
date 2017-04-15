import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { MySavedAddressPage } from './../myaccount/savedAddress';
import { MyEditAddressPage } from './../myaccount/myeditaddress';
import { Address } from './../../providers/address-service/address';
import { checkoutService } from './../../model/checkout/checkout-service';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';
import { Storage } from '@ionic/storage';
import forEach from 'lodash/forEach';
import { ToastService } from './../../providers/toast-service/toastService';
import { PlacedOrder } from './../placedOrder/placedOrder';
import { Events } from 'ionic-angular';
declare let StripeCheckout: any;
@Component({
    selector: 'checkout',
    templateUrl: 'checkout.html'
})
export class Checkout implements OnInit {
    cartData: any;
    address: any;
    checkGift: boolean = false;
    checkGiftEntireOrder: boolean = true;
    checkGiftIndividualOrder: boolean = false;
    shippingMethods: any;
    PaymentMethods: any;
    data = {};
    disable = true;
    selectedPaymentMethod;
    selectedShippingMethod;
    tax: any;
    taxSpin: boolean = false;
    totalPrice: any = 0;
    total;
    shippingAddressForOrderPlaced;
    spin: boolean = false;
    currency_sign: string;
    validate = { "payment": false, "shipping": false, "shippingAddress": false };
    constructor(public _events: Events, private viewCtrl: ViewController, private _toast: ToastService, public _local: Storage, private _appConfigService: AppDataConfigService, private _checkoutService: checkoutService, private _address: Address, private _navCtrl: NavController, public _navParams: NavParams) { }
    ngOnInit() {
        this.cartData = this._navParams.get('res');
        console.log("this.cartData", this.cartData)
        this._address.getAddress().then((address) => {
            this.address = address;
            if (!this.address || this.address['body'].length == 0) {
                this._navCtrl.push(MyEditAddressPage, { "alreadyCheckLength": true, "firstTime": 1, title: "Add New Address" });
            }
        });
        this.placeOrder();
    }
    openCheckout() {
        if (this.selectedPaymentMethod['method_title'] == "Check / Money order") {
            this.orderPlace();
        } else {
            var handler = StripeCheckout.configure({
                key: 'pk_test_9xuVf6AIscOeY2q4aYJPlY4t',
                locale: 'auto',
                token: function(token: any) {
                    console.log("token", token.id);
                    // You can access the token ID with `token.id`.
                    // Get the token ID to your server-side code for use.
                }
            });

            handler.open({
                name: 'Products',
                amount: this.total,
                image: "",
                currency: this.currency_sign
            });
        }
    }
    placeOrder() {
        let products={};
            if (this.cartData && this.cartData.length > 0) {
                forEach(this.cartData, (value, key) => {
                    value['subTotal'] = ((parseFloat(value.total)) * (parseFloat(value.qty)));
                    this.currency_sign = value.currency_sign;
                    this.totalPrice += parseFloat(value.product_subtotal);
                    value.info_buyRequest['info_buyRequest']['product_id']=value.info_buyRequest['info_buyRequest']['product'];
                    products[key]=value.info_buyRequest['info_buyRequest'];
                })
                this.data['products']=products;
            }
    }
    ionViewWillEnter() {
        this.selectedPaymentMethod = false;
        this.selectedShippingMethod = false;
        this.validate.shippingAddress = false;
        this.validate.payment = false;
        this.validate.shipping = false
        this._address.getAddress().then((address) => {
            this.address = address;
        });
        if (this.address) {
            forEach(this.address['body'], (address) => {
                if (address && address.default_shipping) {
                    this.shippingAddressForOrderPlaced = address;
                    this.validate.shippingAddress = true;
                }
            })
        }
        this._checkoutService.getShippingMethods(this.data).then((res: any) => {
            this.shippingMethods = [];
            forEach(res.body.shipping_methods, (value, key) => {
                value['shipping_method'] = key;
                value['selectedShippingMethod'] = false;
                this.shippingMethods.push(value);
            });
        }, (err) => {
            console.log(err)
        });
        this._checkoutService.getPaymentMethods().then((res: any) => {
            this.PaymentMethods = [];
            forEach(res.body.payment_methods, (value, key) => {
                this.PaymentMethods.push(
                    {
                        "method_title": value,
                        "payment_method": key
                    });
            });
        }, (err) => {
            console.log(err)
        });
        this.validateData();
    }
    taxDetails() {
        this.taxSpin = true;
        this.total = this.totalPrice;
        this._checkoutService.getTaxDetail(this.data).then((res: any) => {
            this.disable = false;
            this.tax = res['body'];
            this.taxSpin = false;
            if (this.tax.tax) {
                this.total += parseFloat(this.tax.tax)
            }
            if (this.tax.discount) {
                this.total += parseFloat(this.tax.discount)
            }
            if (this.selectedShippingMethod) {
                this.total += parseFloat(this.selectedShippingMethod['price']);
            }
        });
    }
    changeAddress() {
        this._navCtrl.push(MySavedAddressPage);
    }
    paymentMethod(selectedPaymentMethod) {
        this.validate.payment = false;
        this.data['payment_method'] = selectedPaymentMethod['payment_method'];
        if (selectedPaymentMethod && selectedPaymentMethod['payment_method']) {
            this.validate.payment = true;
        }
        this.validateData();
    }
    shippingMethod(selectedShippingMethod) {
        this.validate.shipping = false;
        this.data['shipping_method'] = selectedShippingMethod['code'];
        if (selectedShippingMethod && selectedShippingMethod['shipping_method']) {
            this.validate.shipping = true;
        }
        this.validateData();
    }
    validateData() {
        let count = 0;
        forEach(this.validate, (value) => {
            if (value) {
                count++;
            }
        })
        if (count == Object.keys(this.validate).length) {
            this.taxDetails();
        } else {
            this.disable = true;
        }
    }
    orderPlace() {
        if (!this.spin) {
            this.spin = true;
            this._checkoutService.orderPlace(this.data).then((res: any) => {
                if (res && res['body'].success) {
                    this.spin = false;
                    this._navCtrl.push(PlacedOrder, { "shippingAddress": this.shippingAddressForOrderPlaced, "orderId": res['body']['success_data']['increment_id'] }).then(() => {
                        const index = this.viewCtrl.index;
                        this._navCtrl.remove(index).then(() => {
                            let shouldRemoveIndex;
                            forEach(this._navCtrl['_views'], (views) => {
                                if (views['name'] == 'CartPage') {
                                    shouldRemoveIndex = views['index'];
                                }
                            })
                            this._navCtrl.remove(shouldRemoveIndex)
                        });
                    });
                } else {
                    this.spin = false;
                    forEach(res['body'].product_error, (value) => {
                        this._toast.toast(value, 3000);
                    })
                }
            }, (err) => {
                this.spin = false;
            })
        }
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

    enableGift() {
    }
}




