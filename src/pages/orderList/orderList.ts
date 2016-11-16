import { Component, OnInit} from '@angular/core';
import { NavController, PopoverController,Events} from 'ionic-angular';
import {ApiService} from './../../providers/api-service/api-service';
import {PopoverPage} from './../../components/popover/popover';
import {OrderModalPage} from '../orderid-detail/orderid-detail';
import {StartPage} from './../../pages/startpage/startpage';
import { TotalOrder } from '../../model/orderList/totalOrder';
import { Storage } from '@ionic/storage';
import {GooglePlus} from 'ionic-native';
import { OrderListDataType } from './../../model/orderList/orderlistDatatype';
import { TotalOrderDataType } from './../../model/orderList/totalOrderDataType';
import slice from 'lodash/slice';
import uniq from 'lodash/uniq';
import flattenDeep from 'lodash/flattenDeep';
import clone from 'lodash/clone';
import forEach from 'lodash/forEach';

@Component({
    templateUrl: 'orderlist.html'
})
export class OrderlistPage implements OnInit {
    totalOrder:TotalOrderDataType;
    totalOrderList:OrderListDataType;
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
    itemsDate: any = [];
    spin: boolean = false;
    startArray: number = 0;
    endArray: number = 4;
    startDateArray: number = 0;
    endDateArray: number = 2;
    constructor(private _events:Events,private _order: TotalOrder, private _local: Storage, private _navCtrl: NavController, private _popoverCtrl: PopoverController, private _apiService: ApiService) { }
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
    ionViewDidEnter() {
       setTimeout( () => {  this._events.publish("title",{title:"My Orders"}); } , 0)
      }
    total_orders() {
        var body = { "secret": this.secret }
        this._order.getTotalOrder(body).then((res) => {
                this.totalOrder=res;
        })
        .catch(err=>{
          this.logout();
        });
    }

    selectedOrder_details() {
        this.spin = true;
        let res_data: any = [];
        let date: any = [];
        let body = { "secret": this.secret }
        let datas: any;
        this._order.getOrderList(body).then((res) => {
            this.spin = false;
            this.totalOrderList=res;
            if (this.totalOrderList.data == 0) {
                this.no_orders = true;
                this.orders_error = "You have no orders";
            } else {
                forEach(this.totalOrderList.data, function(value, key) {
                    date.unshift(value.created_at.split(" ", 1));
                    datas = {
                        value: value
                    };
                    res_data.unshift(datas);
                });
                this.itemsValue = clone(res_data);
                this.values = slice(this.itemsValue, this.startArray, this.endArray);
                this.itemsDate = uniq(flattenDeep(date));
                this.dates = slice(this.itemsDate, this.startDateArray, this.endDateArray);
            }
        })
        .catch((err)=>{
              this.logout();
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