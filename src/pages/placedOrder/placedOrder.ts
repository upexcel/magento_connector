import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {HomePage} from './../home/home';
import {OrderModalPage} from '../orderid-detail/orderid-detail';
import {Storage} from '@ionic/storage';
import forEach from 'lodash/forEach';
@Component({
    selector: 'placed-order',
    templateUrl: 'placedOrder.html'
})
export class PlacedOrder implements OnInit {
    shippingAddress: any;
    orderId: string;
    constructor(public viewCtrl: ViewController, public _navParams: NavParams, public _navCtrl: NavController, public _local: Storage) {}
    ngOnInit() {
        this.shippingAddress = this._navParams.get('shippingAddress');
        this.orderId = this._navParams.get('orderId');
        this._local.remove('CartData');
    }
    c_Shopping() {
        this._navCtrl.setRoot(HomePage);
    }
    viewOrderDetail() {
        this._navCtrl.push(OrderModalPage, {"order_id": this.orderId}).then(() => {
            const index = this.viewCtrl.index;
            this._navCtrl.remove(index)
        });
    }
}
