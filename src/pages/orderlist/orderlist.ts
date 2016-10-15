
import { Component, OnInit} from '@angular/core';
import { NavController, PopoverController} from 'ionic-angular';
import {FormService} from './../../providers/form-service/form-service';
import {PopoverPage} from './../../components/popover/popover';
import {OrderModalPage} from './../orderid-detail/orderid-detail';
import {StartPage} from './../../pages/startpage/startpage';
import { Storage } from '@ionic/storage';
import _ from 'lodash';
import {GooglePlus} from 'ionic-native';
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
    constructor(public local: Storage, public navCtrl: NavController, public popoverCtrl: PopoverController, public _formService: FormService) { }
    ngOnInit() {
        this.local.get('secret').then((value: any) => {
            this.secret = value;
            this.local.get('firstname').then((value: any) => {
                this.firstname = value;
                this.local.get('lastname').then((value: any) => {
                    this.lastname = value;
                    this.total_orders();
                    this.selectedOrder_details();
                });
            });
        });
    }
    total_orders() {
        var body = { "secret": this.secret }
        this._formService.api("order/totalorder", body).subscribe((res) => {
            if (res.statuscode == 500) {
                this.logout();
            }
            if (JSON.parse(res.body).data != 0) {
                this.ttl_show = true;
                this.totalOrders = JSON.parse(res.body).data.total_order;
                this.totalAmount = JSON.parse(res.body).data.total_amount;
            } else {
            }
        })
    }

    selectedOrder_details() {
        this.spin = true;
        let res_data: any = [];
        let date: any = [];
        let body = { "secret": this.secret }
        let datas: any;
        this._formService.api("order/alllist", body).subscribe((res) => {
            this.spin = false;
            if (res.statuscode == 500) {
                this.logout();
            }
            if (JSON.parse(res.body).data == 0) {
                this.no_orders = true;
                this.orders_error = "You have no orders";
            } else {
                this.res = JSON.parse(res.body).data;
                _.forEach(this.res, function(value, key) {
                    date.push(value.created_at.split(" ", 1));
                    datas = {
                        value: value,
                        key: key
                    };
                    res_data.push(datas);
                });
                this.itemsValue = _.reverse(_.clone(res_data));
                this.values = _.slice(this.itemsValue, this.startArray, this.endArray);
                this.itemsDate = _.reverse(_.uniq(_.flattenDeep(date)));
                this.dates = _.slice(this.itemsDate, this.startDateArray, this.endDateArray);
            }
        })
    }
    doInfinite(infiniteScroll: any) {
        if (this.values.length % 2 == 0 || this.dates.length % 2 == 0) {
            if (this.values.length >= this.endArray || this.dates.length >= this.endDateArray) {
                setTimeout(() => {
                    this.endArray += 4;
                    this.endDateArray += 2;
                    this.values = _.slice(this.itemsValue, this.startArray, this.endArray);
                    this.dates = _.slice(this.itemsDate, this.startDateArray, this.endDateArray);
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
                        this.values = _.slice(this.itemsValue, this.startArray, this.endArray);
                        this.dates = _.slice(this.itemsDate, this.startDateArray, this.endDateArray);
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
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }
    presentModal(id: any) {
        this.navCtrl.push(OrderModalPage, { "order_id": id });
    }
    goback() {
        this.navCtrl.pop();
    }
    logout() {
        this.local.remove('firstname');
        this.local.remove('lastname');
        this.local.remove('expiry');
        this.local.remove('access_token');
        this.local.remove('lists');
        this.local.remove('email');
        this.local.remove('secret');
        GooglePlus.logout();
        this.navCtrl.setRoot(StartPage, { "message": "Token expired" });
    }
}

