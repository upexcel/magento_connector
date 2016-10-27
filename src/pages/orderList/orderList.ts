
import { Component, OnInit} from '@angular/core';
import { NavController, PopoverController} from 'ionic-angular';
import {ApiService} from './../../providers/api-service/api-service';
import {PopoverPage} from './../../components/popover/popover';
import {OrderModalPage} from '../orderid-detail/orderid-detail';
import {StartPage} from './../../pages/startpage/startpage';
import { TotalOrder } from '../../modal/orderList/totalOrder';
import { Storage } from '@ionic/storage';
import {GooglePlus} from 'ionic-native';
import forEach from 'lodash/forEach';
import slice from 'lodash/slice';
import uniq from 'lodash/uniq';
import flattenDeep from 'lodash/flattenDeep';
import clone from 'lodash/clone';
import reverse from 'lodash/reverse';
@Component({
    templateUrl: 'orderlist.html'
})
export class OrderlistPage implements OnInit {
    firstname: string;
    lastname: string;
    totalOrders: any;
    totalAmount: any;
    ttl_show: boolean = false;
    res: any;
    values: any;
    dates: any = [];
    orders_error: any;
    secret: any;
    access_token: any;
    no_orders: boolean = false;
    itemsValue: any = [];
    itemsDate: any = [];
    spin: boolean = false;
    startArray: number = 0;
    endArray: number = 4;
    startDateArray: number = 0;
    endDateArray: number = 2;
    constructor(private _product: TotalOrder, private _local: Storage, private _navCtrl: NavController, private _popoverCtrl: PopoverController, private _apiService: ApiService) { }
    ngOnInit() {
        this._local.get('secret').then((value: any) => {
            this.secret = value;
            this._local.get('firstname').then((value: any) => {
                this.firstname = value;
                this._local.get('lastname').then((value: any) => {
                    this.lastname = value;
                    this.total_orders();
                    this.selectedOrder_details();
                });
            });
        });
    }
    total_orders() {
        var body = { "secret": this.secret }
        this._product.getTotalOrder(body).then((res) => {
            if (res.statuscode == 500) {
                this.logout();
            }
            if (res.data != 0) {
                this.ttl_show = true;
                this.totalOrders = res.data.total_order;
                this.totalAmount = res.data.total_amount;
            } else {
            }
        })
        .catch(err=>{

        });
    }

    selectedOrder_details() {
        this.spin = true;
        let res_data: any = [];
        let date: any = [];
        let body = { "secret": this.secret }
        let datas: any;
        this._product.getOrderList(body).then((res) => {
            this.spin = false;
            if (res.statuscode == 500) {
                this.logout();
            }
            if (res.data == 0) {
                this.no_orders = true;
                this.orders_error = "You have no orders";
            } else {
                this.res = res.data;
                forEach(this.res, function(value, key) {
                    date.push(value.created_at.split(" ", 1));
                    datas = {
                        value: value
                    };
                    res_data.push(datas);
                });
                this.itemsValue = reverse(clone(res_data));
                this.values = slice(this.itemsValue, this.startArray, this.endArray);
                this.itemsDate = reverse(uniq(flattenDeep(date)));
                this.dates = slice(this.itemsDate, this.startDateArray, this.endDateArray);
            }
        })
        .catch((err)=>{
          
        })
    }
    doInfinite(infiniteScroll) {
        if (this.values.length % 2 == 0 || this.dates.length % 2 == 0) {
            if (this.values.length >= this.endArray || this.dates.length >= this.endDateArray) {
                setTimeout(() => {
                    this.endArray += 4;
                    this.endDateArray += 2;
                    this.values = slice(this.itemsValue, this.startArray, this.endArray);
                    this.dates = slice(this.itemsDate, this.startDateArray, this.endDateArray);
                    infiniteScroll.complete();
                }, 2000);
            } else {
                infiniteScroll.complete();
            }
        }
        else {
            let checkValue = this.values.length + 1;
            let checkDate = this.dates.length + 1;
            if (checkValue >= this.endArray || checkDate >= this.endDateArray) {

                if (checkValue == this.endArray || checkDate == this.endDateArray) {
                    infiniteScroll.complete();
                }
                else {
                    setTimeout(() => {
                        this.endArray += 4;
                        this.endDateArray += 2;
                        this.values = slice(this.itemsValue, this.startArray, this.endArray);
                        this.dates = slice(this.itemsDate, this.startDateArray, this.endDateArray);
                        infiniteScroll.complete();
                    }, 2000);
                }
            }
            else {
                infiniteScroll.complete();
            }
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
        this._local.remove('firstname');
        this._local.remove('lastname');
        this._local.remove('expiry');
        this._local.remove('access_token');
        this._local.remove('lists');
        this._local.remove('email');
        this._local.remove('secret');
        GooglePlus.logout();
        this._navCtrl.setRoot(StartPage, { "message": "Token expired" });
    }
}
