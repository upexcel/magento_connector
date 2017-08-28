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
    paymentMethod: string;
    orderId: string;
    constructor(public _events: Events, public viewCtrl: ViewController, public _navParams: NavParams, public _navCtrl: NavController, public _local: Storage) {}
    ngOnInit() {
        this.paymentMethod = this._navParams.get('paymentMethod');
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
        if(!this.paymentMethod){
        this._navCtrl.push(OrderModalPage, {"order_id": this.orderId}).then(() => { //move to the OrderModalPage with order id
            this._navCtrl.remove(this._navCtrl.getPrevious(this.viewCtrl).index, 2).then(() => {
            });
        });
    }else{
        this._navCtrl.push(OrderModalPage, {"order_id": this.orderId}).then(() => { //move to the OrderModalPage with order id
            this._navCtrl.remove(this.viewCtrl.index, 1).then(() => {
            });
        });        
    }
    }
}