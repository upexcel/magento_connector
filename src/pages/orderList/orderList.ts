import {Component, OnInit, NgZone} from '@angular/core';
import {NavController, PopoverController, Events} from 'ionic-angular';
import {PopoverPage} from './../../components/popover/popover';
import {OrderModalPage} from '../orderid-detail/orderid-detail';
import {TotalOrder} from '../../model/orderList/totalOrder';
import {OrderListDataType} from './../../model/orderList/orderlistDatatype';
import {TotalOrderDataType} from './../../model/orderList/totalOrderDataType';
import slice from 'lodash/slice';
import forEach from 'lodash/forEach';
import groupBy from 'lodash/groupBy';
import reverse from 'lodash/reverse';
import 'intl';
import 'intl/locale-data/jsonp/en';
@Component({
    selector: 'order-list',
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
    constructor(private _ngZone: NgZone, public events: Events, private _order: TotalOrder, private _navCtrl: NavController, private _popoverCtrl: PopoverController) {}
    ngOnInit() {
        this.total_orders();
        this.selectedOrder_details();
        this.events.subscribe('user:fcm', (orderid) => {  // catch event for update page when localNotifications come 
            this._ngZone.run(() => {
                this.total_orders();
                this.selectedOrder_details();
            });
        });
    }
    ngOnDestroy() {
        this.events.unsubscribe('user:fcm'); //unsubscribe event
    }
    trackmyOrderDataFn(index,data){
        return data.orderId ? data.orderId : index;
    }
    trackmydataItemFn(index,data){
        return index;
    }

    total_orders() {
        this._order.getTotalOrder({}).then((res) => { //col order/totalorder api
            this.totalOrder = res;
        }).catch(err => {});
    }

    selectedOrder_details() {
        this.spin = true;
        let date: any = [];
        this.itemsValue = [];
        this._order.getOrderList({}).then((res) => {  //col order/alllist api to get list of order
            this.spin = false; // stop spinner
            this.totalOrderList = res;
            if (this.totalOrderList.body == 0) {  // check total no. of orders
                this.no_orders = true;
                this.orders_error = "You have no orders";
            } else {
                forEach(this.totalOrderList.body, (value, key) => {
                    date.unshift(value.created_at.split(" ", 1));    //split date and time
                    value['date'] = (value.created_at.split(" "))[0];
                    value['time'] = (value.created_at.split(" "))[1];
                    value['orderId'] = key;
                });
                //create group by date
                this.totalOrderList.body = groupBy(this.totalOrderList.body, 'date');
                forEach(this.totalOrderList.body, (value, key) => {
                    this.itemsValue.unshift({
                        value: reverse(value),
                        key: key
                    });
                });
                this.values = slice(this.itemsValue, this.startArray, this.endArray); //breck data into startArray to endArray
            }
        })
            .catch((err) => {
                this.error = true;
            })
    }
    doInfinite(infiniteScroll) {
        if (this.itemsValue.length > this.endArray) {
            this.endArray += 4; //increment of 4
            this.values = slice(this.itemsValue, this.startArray, this.endArray);//breck data into startArray to endArray
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
        //move to OrderModalPage with order id
        this._navCtrl.push(OrderModalPage, {"order_id": order_id});
    }
    goback() {
        //move back and close current page
        this._navCtrl.pop();
    }
}
