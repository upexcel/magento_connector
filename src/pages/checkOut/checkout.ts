import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MySavedAddressPage } from './../myaccount/savedAddress';
import { MyEditAddressPage } from './../myaccount/myeditaddress';
import { Address } from './../../providers/address-service/address';
import { checkoutService } from './../../providers/checkout/checkout-service';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';
import { Storage } from '@ionic/storage';
import forEach from 'lodash/forEach';
import { ToastService } from './../../providers/toast-service/toastService';

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
    constructor( private _toast: ToastService,public _local: Storage, private _appConfigService: AppDataConfigService, private _checkoutService: checkoutService, private _address: Address, private _navCtrl: NavController, public _navParams: NavParams) { }
    ngOnInit() {
        this.cartData = this._navParams.get('res');
        this._address.getAddress().then((address) => {
            this.address = address['body'];
            if (!this.address || this.address.length == 0) {
                this._navCtrl.push(MyEditAddressPage, { "alreadyCheckLength": true });
            }
        });
        this.placeOrder()
    }
    placeOrder() {
        let products: any = {};
        this._appConfigService.getUserData().then((userData: any) => {
            this.data["secret"] = userData['secret'];
            this._local.get('store_id').then((store_id: any) => {
                if (userData) {
                    this.data["store_id"] = store_id ? store_id : "";
                    if (this.cartData && this.cartData.length > 0) {
                        forEach(this.cartData, (value, key) => {
                            products = {};
                            products["product_id"] = value.productid;
                            if (value.type != "grouped") {
                                products["qty"] = 1;
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
                }
            })
        })
    }
    ionViewWillEnter() {
        this._address.getAddress().then((address) => {
            this.address = address['body'];
        });
        this._checkoutService.getShippingMethods().then((res: any) => {
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
    }
    changeAddress() {
        this._navCtrl.push(MySavedAddressPage);
    }
    paymentMethod(selectedPaymentMethod){
        this.data['payment_method']=selectedPaymentMethod['payment_method'];
    }
    shippingMethod(selectedShippingMethod){
         this.data['shipping_method']=selectedShippingMethod['shipping_method'];
    }
    orderPlace(){
        this._checkoutService.orderPlace(this.data).then((res:any )=>{
            if(res && res['body'].data.success){
                console.log("success");
            }else{
            forEach(res['body'].data.product_error,(value)=>{
                this._toast.toast(value);
            })
            }
        })
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
    quantityPrice(total, qty) {
        return ((parseFloat(total)) * (parseFloat(qty)));
    }
    enableGift() {
        console.log('hi', this.checkGift)
    }
}




