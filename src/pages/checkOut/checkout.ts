import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MySavedAddressPage } from './../myaccount/savedAddress';
import { MyEditAddressPage } from './../myaccount/myeditaddress';
import { Address } from './../../providers/address-service/address';
import { checkoutService } from './../../providers/checkout/checkout-service';
import forEach from 'lodash/forEach';
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
    shippingMethods:any;
    constructor(private _checkoutService: checkoutService, private _address: Address, private _navCtrl: NavController, public _navParams: NavParams) { }
    ngOnInit() {
        this.cartData = this._navParams.get('res');
        this._address.getAddress().then((address) => {
            this.address = address['body'];
            if (!this.address || this.address.length == 0) {
                this._navCtrl.push(MyEditAddressPage,{"alreadyCheckLength":true});
            }
        });
        this._checkoutService.getShippingMethods().then((res:any)=>{
            this.shippingMethods = [];
            forEach(res.body.shipping_methods,(value,key)=>{
                value['shipping_method'] = key;
                value['selectedShippingMethod'] = false;
                this.shippingMethods.push(value);
            });
            console.log(this.shippingMethods)
            console.log(res)
        }, (err)=>{
            console.log(err)
        })
    }
    ionViewWillEnter() {
        this._address.getAddress().then((address) => {
            this.address = address['body'];
        })
    }
    changeAddress() {
        this._navCtrl.push(MySavedAddressPage);
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




