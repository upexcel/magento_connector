import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, Events } from 'ionic-angular';
import { ApiService } from './../../providers/api-service/api-service';
import { PopoverPage } from './../../components/popover/popover';
import { OrderModalPage } from '../orderid-detail/orderid-detail';
import { TotalOrder } from '../../model/orderList/totalOrder';
import { Storage } from '@ionic/storage';
import { OrderListDataType } from './../../model/orderList/orderlistDatatype';
import { TotalOrderDataType } from './../../model/orderList/totalOrderDataType';
import { LogoutService } from './../../providers/logout/logout-service';
import slice from 'lodash/slice';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';
import forEach from 'lodash/forEach';
import groupBy from 'lodash/groupBy';
@Component({
    templateUrl: 'orderlist.html'
})
export class OrderlistPage implements OnInit {
    totalOrder: TotalOrderDataType;
    totalOrderList: OrderListDataType;
    firstname: string;
    lastname: string;
    res: any;
    values: any;
    dates: any = [];
    orders_error: any;
    secret: any;
    access_token: any;
    no_orders: boolean = false;
    itemsValue: any = [];
    spin: boolean = false;
    error: boolean = false;
    startArray: number = 0;
    endArray: number = 5;
    message: string = "Token expired";
    constructor(private _appConfigService: AppDataConfigService, private _logout: LogoutService, private _events: Events, private _order: TotalOrder, private _local: Storage, private _navCtrl: NavController, private _popoverCtrl: PopoverController, private _apiService: ApiService) { }
    ngOnInit() {
        this._appConfigService.getUserData().then((userData: any) => {
            this.secret = userData.secret;
            this.firstname = userData.firstname;
            this.lastname = userData.lastname;
            this.total_orders();
            this.selectedOrder_details();
        });
    }

    total_orders() {
        var body = { "secret": this.secret }
        this._order.getTotalOrder(body).then((res) => {
            this.totalOrder = res;
        })
            .catch(err => {
                this.logout();
            });
    }

    selectedOrder_details() {
        this.spin = true;
        let date: any = [];
        this.itemsValue = [];
        let body = { "secret": this.secret }
        this._order.getOrderList(body).then((res) => {
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
                        value: value,
                        key: key
                    });
                });
                console.log("dfjokn", this.itemsValue);
                this.values = slice(this.itemsValue, this.startArray, this.endArray);
            }
        })
            .catch((err) => {
                console.log("err", err)
                this.error = true;
                //                this.logout();
            })
    }
    doInfinite(infiniteScroll) {
        if (this.itemsValue.length > this.endArray) {
            this.endArray += 5;
            this.values = slice(this.itemsValue, this.startArray, this.endArray);
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
    logout() {
        this._logout.logout(this.message, this._navCtrl);
    }
}
