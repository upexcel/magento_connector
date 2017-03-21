import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, Events, NavParams } from 'ionic-angular';
import { MySavedAddressPage } from './../myaccount/savedAddress';
import { Address } from './../../providers/address-service/address';

@Component({
    selector:'checkout',
    templateUrl: 'checkout.html'
})
export class Checkout implements OnInit {
    cartData: any;
    address: any;
    checkGift:boolean=false;
    checkGiftEntireOrder:boolean=true;
    checkGiftIndividualOrder:boolean=false;
    constructor(private _address: Address, private _navCtrl: NavController, public _navParams: NavParams) { }
    ngOnInit() {
        this.cartData = this._navParams.get('res');
        this._address.getAddress().then((address) => {
            this.address = address['body'];
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
        return (total * 1) * (qty * 1);
    }
    enableGift(){
        console.log('hi',this.checkGift)
    }
}




