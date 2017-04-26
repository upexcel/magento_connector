import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController, PopoverController, Events } from 'ionic-angular';
import { ApiService } from './../../providers/api-service/api-service';
import { PopoverPage } from './../../components/popover/popover';
import forEach from 'lodash/forEach';
import { OrderIdDetail } from './../../model/orderid-detail/orderid-detail';
//import { OrderIdDetailDataType } from './../../model/orderid-detail/orderid-detailData';

@Component({
    templateUrl: 'orderid-detail.html'
})

export class OrderModalPage implements OnInit {
    orderid_detail: any;
    order_id: number;
    items: Array<any>;
    showOrder: boolean = false;
    showOrderError: boolean = false;
    spin: boolean = false;
    constructor(private _orderdetail: OrderIdDetail, private _navparam: NavParams, private _popoverCtrl: PopoverController, private _viewCtrl: ViewController, private _apiService: ApiService) { }
    ngOnInit() {
        this.order_id = this._navparam.get("order_id");
        this.getOrderDetails(this.order_id);
    }

    close() {
        this._viewCtrl.dismiss();
    }
    getOrderDetails(order_id) {
        let body = {
            order_id: order_id
        }
        this.spin = true;
        this._orderdetail.getHomeProducts(body).then((res) => {
            this.orderid_detail = res;
            this.spin = false;
            if (this.orderid_detail.message == '') {
                this.showOrderError = true;
            } else {
                this.showOrder = true;
                this.items = [];
                forEach(this.orderid_detail['body'].items, (value, key) => {
                    var datas = {
                        value: value,
                        key: key
                    };
                    this.items.push(datas);
                })
            }
        }).catch((err) => {
            this.spin = false;

        });
    }

    presentPopover(myEvent: any) {
        let popover = this._popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }
    track() {

    }
}
