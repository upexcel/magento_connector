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
import { Platform } from 'ionic-angular';
//declare let RazorpayCheckout: any;
declare let StripeCheckout: any;
@Component({
    selector: 'checkout',
    templateUrl: 'checkout.html'
})
export class Checkout implements OnInit {
    cartData: any;
    address: object;
    checkGift: boolean = false;
    checkGiftEntireOrder: boolean = true;
    checkGiftIndividualOrder: boolean = false;
    shippingMethods: Array<any>;
    PaymentMethods: Array<any>;
    data: object = {};
    disable = true;
    selectedPaymentMethod: any;
    selectedShippingMethod: any;
    tax: any;
    taxSpin: boolean = false;
    totalPrice: any = 0;
    grandTotal: any;
    discount: any;
    shippingAddressForOrderPlaced: string;
    spin: boolean = false;
    currency_sign: string;
    validate = { "payment": false, "shipping": false, "shippingAddress": false };
    constructor(private platform: Platform, public _events: Events, private viewCtrl: ViewController, private _toast: ToastService, public _local: Storage, private _appConfigService: AppDataConfigService, private _checkoutService: checkoutService, private _address: Address, private _navCtrl: NavController, public _navParams: NavParams) { }
    ngOnInit() {
        this.cartData = this._navParams.get('res');
        this._address.getAddress().then((address) => {
            this.address = address;
            if (!this.address || this.address['body'].length == 0) {
                this._navCtrl.push(MyEditAddressPage, { "alreadyCheckLength": true, "firstTime": 1, title: "Add New Address" });
            }
        });
        this.createPlaceOrderData();
    }
    openCheckout(orderData, successData) {
        let data = {};
        // .razorpay.cordova implimented
        //        var options = {
        //            description: 'Credits towards consultation',
        //            image: 'https://i.imgur.com/3g7nmJC.png',
        //            currency: 'INR',
        //            key: 'rzp_test_1DP5mmOlF5G5ag',
        //            amount: '5000',
        //            name: 'foo',
        //            prefill: {
        //                email: 'pranav@razorpay.com',
        //                contact: '8879524924',
        //                name: 'Pranav Gupta'
        //            },
        //            theme: {
        //                color: '#F37254'
        //            },
        //            modal: {
        //                ondismiss: function() {
        //                    alert('dismissed')
        //                }
        //            }
        //        };
        //
        //        var successCallback = function(payment_id) {
        //            alert('payment_id: ' + payment_id);
        //        };
        //
        //        var cancelCallback = function(error) {
        //            alert(error.description + ' (Error ' + error.code + ')');
        //        };
        //
        //        this.platform.ready().then(() => {
        //            if (this.platform.is('cordova')) {
        //                RazorpayCheckout.open(options, successCallback, cancelCallback);
        //            }
        //        })


        data['increment_id'] = orderData.increment_id;
        data['customer_id'] = orderData.customer_id;
        var submittedForm = false;
        var handler = StripeCheckout.configure({
            key: 'pk_test_9xuVf6AIscOeY2q4aYJPlY4t',
            locale: 'auto',
            token: (token: any) => {
                data['success'] = "true";
                data['stripe'] = {};
                data['stripe']['id'] = token['card'].id;
                data['stripe']['object'] = token['card'].object;
                data['stripe'] = token;
                submittedForm = true;
                // You can access the token ID with `token.id`.
                // Get the token ID to your server-side code for use.
                this._checkoutService.updateStripePayment(data).then((res) => {
                    if (res['body'].success) {
                        this._navCtrl.push(PlacedOrder, successData).then(() => {
                            const index = this.viewCtrl.index;
                            this._navCtrl.remove(index);
                        });
                    } else {
                        this.spin = false;
                        this._navCtrl.popToRoot();
                    }

                }, (err) => {
                    this.spin = false;
                    console.log(err);
                })
            }
        });
        handler.open({
            name: 'Products',
            amount: (parseFloat(this.grandTotal) * 100),
            image: "",
            currency: "USD",
            closed: () => {
                if (submittedForm == false) {
                    data['success'] = "false";
                    this._checkoutService.updateStripePayment(data).then((res) => {
                        this._toast.toast('Payment cancel by user', 3000);
                        this._navCtrl.popToRoot();
                    })
                }
                this.spin = false;
            }
        });
    }
    createPlaceOrderData() {
        let products = {};
        this.totalPrice = this.cartData.subtotal_without_discount;
        this.tax = this.cartData.tax;
        this.discount = this.cartData.discount;
        this.grandTotal = this.cartData.grandtotal;
        if (this.cartData.cart_items && this.cartData.cart_items.length > 0) {
            forEach(this.cartData.cart_items, (value, key) => {
                value['subTotal'] = ((parseFloat(value.total)) * (parseFloat(value.qty)));
                this.currency_sign = value.currency_sign;
                value.info_buyRequest['info_buyRequest']['product_id'] = value['product_id'];
                products[key] = value.info_buyRequest['info_buyRequest'];
            })
            this.data['products'] = products;
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
        this._checkoutService.getShippingMethods({}).then((res: any) => {
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
            this.PaymentMethods.push(
                {
                    "method_title": "Stripe",
                    "payment_method": "stripe"
                });
        }, (err) => {
        });
        this.validateData();
    }
    taxDetails() {
        this.taxSpin = true;
        this._checkoutService.getTaxDetail(this.data).then((res: any) => {
            let resposnseTax = res['body'];
            this.tax = resposnseTax['tax'];
            this.grandTotal = resposnseTax['quote']['grand_total'];
            this.disable = false;
            this.taxSpin = false;
        }, (err) => {
            this.taxSpin = false;
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
                    if (this.selectedPaymentMethod['method_title'] == "Check / Money order") {
                        this.spin = false;
                        this._navCtrl.push(PlacedOrder, { "shippingAddress": this.shippingAddressForOrderPlaced, "orderId": res['body']['success_data']['increment_id'] }).then(() => {
                            const index = this.viewCtrl.index;
                            this._navCtrl.remove(index);
                        });
                    } else {
                        this.openCheckout(res['body'].success_data, { "shippingAddress": this.shippingAddressForOrderPlaced, "orderId": res['body']['success_data']['increment_id'] });
                    }

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




