import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, PopoverController, Events } from 'ionic-angular';
import { PopoverPage } from './../../components/popover/popover';
import { OrderModalPage } from '../orderid-detail/orderid-detail';
import { TotalOrder } from '../../model/orderList/totalOrder';
import { OrderListDataType } from './../../model/orderList/orderlistDatatype';
import { TotalOrderDataType } from './../../model/orderList/totalOrderDataType';
import slice from 'lodash/slice';
import forEach from 'lodash/forEach';
import groupBy from 'lodash/groupBy';
import reverse from 'lodash/reverse';
import 'intl';
import 'intl/locale-data/jsonp/en';
@Component({
    templateUrl: 'orderlist.html'
})
export class OrderlistPage implements OnInit {
    totalOrder: TotalOrderDataType;
    totalOrderList: OrderListDataType;
    values: Array<any>;
    orders_error: string;
    access_token: string;
    no_orders: boolean = false;
    itemsValue: Array<any> = [];
    spin: boolean = false;
    error: boolean = false;
    startArray: number = 0;
    endArray: number = 4;
    message: string = "Token expired";
    constructor(private _ngZone: NgZone, public events: Events, private _order: TotalOrder, private _navCtrl: NavController, private _popoverCtrl: PopoverController) { }
    ngOnInit() {
        this.total_orders();
        this.selectedOrder_details();
        this.events.subscribe('user:fcm', (orderid) => {
            this._ngZone.run(() => {
                this.total_orders();
                this.selectedOrder_details();
            });
        });
    }
    ngOnDestroy() {
        this.events.unsubscribe('user:fcm');
    }

    total_orders() {
        this._order.getTotalOrder({}).then((res) => {
            this.totalOrder = res;
        }).catch(err => { });
    }

    selectedOrder_details() {
        this.spin = true;
        let date: any = [];
        this.itemsValue = [];
        this._order.getOrderList({}).then((res) => {
            this.spin = false;
            this.totalOrderList = res;
            if (this.totalOrderList.body == 0) {
                this.no_orders = true;
                this.orders_error = "You have no orders";
            } else {
                forEach(this.totalOrderList.body, (value, key) => {
                    date.unshift(value.created_at.split(" ", 1));
                    value['date'] = (value.created_at.split(" "))[0];
                    value['time'] = (value.created_at.split(" "))[1];
                    value['orderId'] = key;
                });
                this.totalOrderList.body = groupBy(this.totalOrderList.body, 'date');
                forEach(this.totalOrderList.body, (value, key) => {
                    this.itemsValue.unshift({
                        value: reverse(value),
                        key: key
                    });
                });
                this.values = slice(this.itemsValue, this.startArray, this.endArray);
            }
        })
            .catch((err) => {
                console.log("err", err)
                this.error = true;
            })
    }
    doInfinite(infiniteScroll) {
        if (this.itemsValue.length > this.endArray) {
            this.endArray += 4;
            this.values = slice(this.itemsValue, this.startArray, this.endArray);
            infiniteScroll.complete();
        } else {
            infiniteScroll.complete();
            infiniteScroll.enable(false);
        }
    }

    presentPopover(myEvent: any) {
        let popover = this._popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }
    gotoOrderDetail(order_id) {
        this._navCtrl.push(OrderModalPage, { "order_id": order_id });
    }
    goback() {
        this._navCtrl.pop();
    }
}
