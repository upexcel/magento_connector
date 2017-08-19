import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {MySavedAddressPage} from './../myaccount/savedAddress';
import {MyEditAddressPage} from './../myaccount/myeditaddress';
import {Address} from './../../providers/address-service/address';
import {checkoutService} from './../../model/checkout/checkout-service';
import {Storage} from '@ionic/storage';
import forEach from 'lodash/forEach';
import {ToastService} from './../../providers/toast-service/toastService';
import {PlacedOrder} from './../placedOrder/placedOrder';
import {CartFunction} from './../../model/cart/cartHandling';
import {Events} from 'ionic-angular';
import {Keyboard} from '@ionic-native/keyboard';
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
    shipping_amount: number = 0;
    shippingAddressForOrderPlaced: string;
    spin: boolean = false;
    currency_sign: string;
    validate = {"payment": false, "shipping": false, "shippingAddress": false}; //use for validation
    constructor(private _cartFunction: CartFunction, private _keyboard: Keyboard, public _events: Events, private viewCtrl: ViewController, private _toast: ToastService, public _local: Storage, private _checkoutService: checkoutService, private _address: Address, private _navCtrl: NavController, public _navParams: NavParams) {}
    ngOnInit() {
        this.cartData = this._navParams.get('res');// cart data come from cart page
        this._address.getAddress().then((address) => { //call service providers/address-service/ to get address 
            this.address = address;
            if (!this.address || this.address['body'].length == 0) { // if address not found 
                //redirect to MyEditAddressPage with alreadyCheckLength to check it move by checkout page
                this._navCtrl.push(MyEditAddressPage, {"alreadyCheckLength": true, "firstTime": 1, title: "Add New Address"});
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
        //                callor: '#F37254'
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
        //stripe code
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
                this.spin = true;
                this._checkoutService.updateStripePayment(data).then((res) => {
                    if (res['body'].success) {
                        setTimeout(() => {
                            this.spin = false;
                        }, 500);
                        this._navCtrl.push(PlacedOrder, successData).then(() => {
                            this._navCtrl.remove(this._navCtrl.getPrevious(this.viewCtrl).index, 2); //close current page 
                        });
                    } else {
                        setTimeout(() => {
                            this.spin = false;
                        }, 500);
                        this._navCtrl.popToRoot();
                    }

                }, (err) => {
                    setTimeout(() => {
                        this.spin = false;
                    }, 500);
                })
            }
        });
        handler.open({
            name: 'Products',
            amount: (parseFloat(this.grandTotal) * 100),
            image: "",
            currency: "USD",
            closed: () => {
                if (submittedForm == false) {//if payment cancle
                    data['success'] = "false";
                    this._checkoutService.updateStripePayment(data).then((res) => {
                        this._toast.toast('Payment cancel by user', 3000);
                        setTimeout(() => {
                            this.spin = false;
                        }, 500);
                        this._keyboard.close();
                        this._navCtrl.popToRoot();
                    })
                }
                this._cartFunction.setCartData().then((resp) => {
                }, (err) => {})
                this._keyboard.close();
            }
        });
    }
    /*
     * create data for place order
     */
    createPlaceOrderData() {
        let products = {};
        this.totalPrice = this.cartData.subtotal_without_discount; //get subtotal price without discount from service
        this.tax = this.cartData.tax; //get tax amount on cart
        this.discount = this.cartData.discount; // get discount price on cart
        this.grandTotal = this.cartData.grandtotal;  // get grandtotal price on cart
        this.shipping_amount = this.cartData.shipping_amount;
        if (this.cartData.cart_items && this.cartData.cart_items.length > 0) {
            forEach(this.cartData.cart_items, (value, key) => {
                value['subTotal'] = ((parseFloat(value.total)) * (parseFloat(value.qty)));
                this.currency_sign = value.currency_sign; //hold currency_sign
                value.info_buyRequest['info_buyRequest']['product_id'] = value['product_id'];
                products[key] = value.info_buyRequest['info_buyRequest'];
            })
            this.data['products'] = products;
        }
    }
    /*
     *  call when view will enter
     */
    ionViewWillEnter() {

        this.selectedPaymentMethod = false;
        this.selectedShippingMethod = false;
        this.validate.shippingAddress = false; //validation false
        this.validate.payment = false;//validation false
        this.validate.shipping = false; //validation false
        this.shippingMethods=null;
        this._address.getAddress().then((address) => { //call service in providers/address-service/ to get address update on view
            this.address = address;
            if (this.address) {
                forEach(this.address['body'], (address) => {
                    if (address && address.default_shipping) {
                        this.shippingAddressForOrderPlaced = address;
                        this.validate.shippingAddress = true; //shippingAddress validation true
                    }
                })
            }
        });
        this._checkoutService.getShippingMethods({}).then((res: any) => { //call cart/getShippingMethods/ api to get Shipping Methods 
            this.shippingMethods = [];
            forEach(res.body.shipping_methods, (value, key) => {
                value['shipping_method'] = key;
                value['selectedShippingMethod'] = false;
                this.shippingMethods.push(value);
            });
        }, (err) => {
            console.log(err)
        });
        this._checkoutService.getPaymentMethods().then((res: any) => { // call cart/getPaymentMethods/ api to get payment method
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
        this.validateData(); // call function for check validation
    }
    /*
     * call cart/getTaxAmount api to get tax detail
     */
    taxDetails() {
        this.taxSpin = true;
        this._checkoutService.getTaxDetail(this.data).then((res: any) => {
            let resposnseTax = res['body'];
            this.tax = resposnseTax['tax'];
            this.discount = resposnseTax['discount'];
            this.grandTotal = resposnseTax['quote']['grand_total'];
            this.disable = false;
            this.taxSpin = false;
        }, (err) => {
            this.taxSpin = false;
        });
    }
    changeAddress() {
        //move to MySavedAddressPage
        if(this.disable){
        this._navCtrl.push(MySavedAddressPage);
        }
    }
    /*
     * call when paymentMethod selected(manage payment Method)
     */
    paymentMethod(selectedPaymentMethod) {
        this.validate.payment = false;
        this.data['payment_method'] = selectedPaymentMethod['payment_method'];
        if (selectedPaymentMethod && selectedPaymentMethod['payment_method']) {
            this.validate.payment = true;
        }
        this.validateData();
    }
    /*
     * call when shippingMethod selected(manage shipping Method)
     */
    shippingMethod(selectedShippingMethod) {
        this.shipping_amount = selectedShippingMethod.price;
        this.validate.shipping = false;
        this.data['shipping_method'] = selectedShippingMethod['code'];
        if (selectedShippingMethod && selectedShippingMethod['shipping_method']) {
            this.validate.shipping = true;
        }
        this.validateData();
    }
    /*
     * function use for validation
     */
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
    /*
     * function use for order place
     */
    orderPlace() {
        if (!this.spin) { // for handle multiple clicking
            this.spin = true;  //spinner on
            this._checkoutService.orderPlace(this.data).then((res: any) => { //call "onepage/placeOrder" api for order place
                if (res && res['body'].success) {
                    if (this.selectedPaymentMethod['method_title'] == "Check / Money order") {
                        this.spin = false;
                        //move to PlacedOrder page
                        this._navCtrl.push(PlacedOrder, {"shippingAddress": this.shippingAddressForOrderPlaced, "orderId": res['body']['success_data']['increment_id']}).then(() => {
                            this._navCtrl.remove(this._navCtrl.getPrevious(this.viewCtrl).index, 2); //close current page 
                        });
                        this._cartFunction.setCartData().then((resp) => {
                        }, (err) => {})
                    } else {
                        this.spin = true;
                        this.openCheckout(res['body'].success_data, {"shippingAddress": this.shippingAddressForOrderPlaced, "orderId": res['body']['success_data']['increment_id']});
                    }

                } else {
                    this.spin = false;
                    this._cartFunction.setCartData().then((resp) => {
                    }, (err) => {})
                    if (res['body'] && res['body'].error_msg) {
                        this._toast.toast(res['body'].error_msg, 3000);
                    }
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




