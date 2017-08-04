import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {OrderModalPage} from '../orderid-detail/orderid-detail';
import {Storage} from '@ionic/storage';
import {Events} from 'ionic-angular';
@Component({
    selector: 'placed-order',
    templateUrl: 'placedOrder.html'
})
export class PlacedOrder implements OnInit {
    shippingAddress: object;
    orderId: string;
    constructor(public _events: Events, public viewCtrl: ViewController, public _navParams: NavParams, public _navCtrl: NavController, public _local: Storage) {}
    ngOnInit() {
        this.shippingAddress = this._navParams.get('shippingAddress');
        this.orderId = this._navParams.get('orderId'); // get order id
        this._local.remove('CartData'); // remove CartData
        this._events.publish('cartItems:length', 0); // throw event for cartItems
    }
    c_Shopping() {
        this._navCtrl.popToRoot();// move to the root page 
    }
    root() {
        this._navCtrl.popToRoot();// move to the root page 
    }
    viewOrderDetail() {
        this._navCtrl.push(OrderModalPage, {"order_id": this.orderId}).then(() => { //move to the OrderModalPage with order id
            const index = this.viewCtrl.index;
            this._navCtrl.remove(index) // remove current page
        });
    }
}
