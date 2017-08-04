import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ViewController, LoadingController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {CartFunction} from '../../model/cart/cartHandling';
import {ProductPage} from './../product/product';
import {ActionSheetController, AlertController} from 'ionic-angular';
import {Checkout} from './../checkOut/checkout';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {ToastService} from './../../providers/toast-service/toastService';
import {LoginPage} from './../login/login';
import {Events} from 'ionic-angular';
import forEach from 'lodash/forEach';
@Component({
    selector: 'cart',
    templateUrl: 'cart.html'
})
export class CartPage implements OnInit {
    // hold cart data come via service
    res: any;
    //use to hold cart coupon code
    couponCode: string;
    //hold final data use in api like for apply coupon
    data = {};
    //handle spinner on apply Coupon
    couponCodeSpin: boolean = false;
    //hold currency_sign
    currency_sign;
    //hold subtotal price without discount
    totalPrice: number = 0;
    // hold discount price
    discount: number = 0;
    //hold tax
    tax: number = 0;
    //hold grandtotal price
    grandtotalPrice: number = 0;
    //handle spinner on delete Coupon
    deleteCouponCodeSpin: boolean = false;
    //handle spinner placeOrderSpin
    placeOrderSpin: boolean = false;
    constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController, public _events: Events, private _appConfigService: AppDataConfigService, private _toast: ToastService, public _actionSheetCtrl: ActionSheetController, private _cartFunction: CartFunction, public local: Storage, public _navCtrl: NavController, public navParams: NavParams, public _viewCtrl: ViewController) {}
    ngOnInit() {
        //call service to get cart data.
        this.res = this._cartFunction.getCart();
        //call createData funtion for manipulation data and pass cart data as parameter 
        this.createData(this.res)
    }
    createData(cartData) {
        //check cart data is exist or not
        if (cartData) {
            //get subtotal price without discount.
            this.totalPrice = cartData.subtotal_without_discount;
            // get discount price on cart
            this.discount = cartData.discount;
            // get grandtotal on cart
            this.grandtotalPrice = cartData.grandtotal;
            //get tax amount on cart
            this.tax = cartData.tax;
            //get cart coupon code if applicable 
            this.couponCode = cartData.coupon_code;
            let products: any = {};
            //check cart data should not empty undefined or blank array 
            if (cartData && cartData.cart_items && cartData.cart_items.length > 0) {
                forEach(cartData.cart_items, (value, key) => {
                    //value['vertualQty'] it will use to hold previous quentity
                    value['vertualQty'] = value.product_qty;
                    // hold currency sign 
                    this.currency_sign = value.currency_sign;
                    value.info_buyRequest['info_buyRequest']['product_id'] = value.info_buyRequest['info_buyRequest']['product'];
                    products[key] = value.info_buyRequest['info_buyRequest'];
                })
                //data use in apply coupon 
                this.data['products'] = products;
            }
        }
    }
    // function call when view will enter
    ionViewWillEnter() {
        // throw event which will receive by header to check and refresh new cart length

        this._events.publish('check:login', true);
    }
    /**    
    * changeQuantity    
    *    
    * function use for quantity change (update quantity)    
    **/
    changeQuantity(data) {
        //check ,is user select pop up to write quantity
        if (data.product_qty == "More") {        //if yes
            let prompt = this.alertCtrl.create({             //create alert with title
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
                        handler: promptData => {                          //call when press cancel button
                            data.product_qty = data['vertualQty'];
                        }
                    },
                    {
                        text: 'Ok',                                        //call when press ok
                        handler: promptData => {
                            if (promptData.qty == '0') {                    //check selected quantity should not 0
                                return false;
                            } else {
                                data.product_qty = promptData.qty;          //update selected value of item object
                                let cartData = {}
                                let qty = {};
                                qty[data.product_id] = {};
                                qty[data.product_id]['qty'] = data.product_qty;
                                cartData['update_cart'] = qty;
                                let loading = this.loadingCtrl.create({
                                    content: 'Please wait...'
                                });
                                loading.present();
                                // call api via model send cartData as update quantity
                                this._cartFunction.updateCart(cartData).then((res) => {
                                    //if success
                                    if (res && res['body']['success']) {
                                        //call service and get updated cart data
                                        this.res = this._cartFunction.getCart();
                                        //call createData function
                                        this.createData(this.res);
                                        //update vertualQty value
                                        data['vertualQty'] = data['product_qty'];
                                    } else {
                                        // if quantity not exist then copy old quantity on data['product_qty']
                                        data['product_qty'] = data['vertualQty'];
                                    }

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
        }
        else {  // use when user select direct choice from select box not write manual text queantity
            let cartData = {}
            let qty = {};
            qty[data.product_id] = {};
            qty[data.product_id]['qty'] = data.product_qty;
            cartData['update_cart'] = qty;
            let loading = this.loadingCtrl.create({
                content: 'Please wait...'
            });
            loading.present();
            // call api via model send cartData as update quantity
            this._cartFunction.updateCart(cartData).then((res) => {
                //update vertualQty value
                if (res.body.success) {
                    data['product_qty'] = qty[data.product_id]['qty'];
                } else {
                    data['product_qty'] = data['vertualQty'];
                }
                //call service and get updated cart data
                this.res = this._cartFunction.getCart();
                //call function
                this.createData(this.res);
//                data.product_qty = qty[data.product_id]['qty'];
                loading.dismiss();
            }, (err) => {
                loading.dismiss();

            })
        }
    }
    /**    
    * deleteProduct    
    *    
    * function call when product deleted on cart page and data is use as parameter which hold item object    
    **/

    deleteProduct(data) {
        let actionSheet = this._actionSheetCtrl.create({    //create actionSheetCtrl
            title: 'Are you sure you want to remove ' + data.product_name,
            buttons: [{
                text: 'Yes',
                handler: () => {
                    let loading = this.loadingCtrl.create({
                        content: 'Please wait...'
                    });
                    loading.present();
                    //call cart/delete api via model and pass item_id
                    this._cartFunction.deleteItem({"item_id": data['item_id']}).then((res) => {
                        //call service and get updated cart data
                        this.res = this._cartFunction.getCart();
                        //call function
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
    /**
    * edit
    *
    * function edit call when user click on edit button with data (item object) argument
    **/

    edit(data) {
        //product_type
        data['type'] = data['product_type'];
        //navigate to ProductPage with needed data
        this._navCtrl.push(ProductPage, {'id': data['product_sku'], "editCartData": data.info_buyRequest['info_buyRequest'], "item_id": data['item_id'], "quote_id": data['quote_id'], "editProductQuantity": data['product_qty']}).then(() => {
            const index = this._viewCtrl.index; // close this page 
            this._navCtrl.remove(index);
        });
    }

    /**
    * checkTypeOf
    *
    * function checkTypeOf is use for checking varible type (object or something else) 
    **/

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
    // function use to navigate  on root page
    c_Shopping() {
        this._navCtrl.popToRoot();
    }
    // function use for placeOrder
    placeOrder() {
        if (!this.placeOrderSpin) {
            this.placeOrderSpin = true;
            //service use to call AppDataConfigService to fetch user data
            this._appConfigService.getUserData().then((userData: any) => {
                if (userData) {
                    //check item exist or not
                    if (this.res && this.res.cart_items && this.res.cart_items.length > 0) {
                        //move to Checkout page with data
                        this._navCtrl.push(Checkout, {res: this.res});
                    } else {
                        this._toast.toast("No product in cart. Please add first.", 3000);
                    }
                    //stop spin
                    this.placeOrderSpin = false;
                } else {
                    this.placeOrderSpin = false;
                    //move to LoginPage
                    this._navCtrl.push(LoginPage, {checkoutLogin: true, res: this.res});
                    this._toast.toast("Please Login First !!", 3000);
                }
            })
        }
    }

    /** applyCoupon
    *
    * function call when coupan will apply with couponCode name come as argument
    **/

    applyCoupon(couponCode) {
        if (couponCode && couponCode.trim().length > 0) {
            if (couponCode == 'delete') {
                this.deleteCouponCodeSpin = true;
            } else {
                this.couponCodeSpin = true;
            }
            this.data['couponcode'] = couponCode.trim();
            //call api for applyCoupon via model
            this._cartFunction.applyCoupon(this.data).then((res: any) => {
                res = res['body'];
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
