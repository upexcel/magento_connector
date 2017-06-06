import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { NavParams, ViewController, PopoverController, Events, Content } from 'ionic-angular';
import { ApiService } from './../../providers/api-service/api-service';
import { PopoverPage } from './../../components/popover/popover';
import forEach from 'lodash/forEach';
import { OrderIdDetail } from './../../model/orderid-detail/orderid-detail';
//import { OrderIdDetailDataType } from './../../model/orderid-detail/orderid-detailData';
@Component({
    templateUrl: 'orderid-detail.html'
})

export class OrderModalPage implements OnInit {
    @ViewChild(Content) content: Content;
    orderid_detail: any;
    order_id: any;
    items: Array<any>;
    showOrder: boolean = false;
    showOrderError: boolean = false;
    spin: boolean = false;
    constructor(private _ngZone: NgZone, public events: Events, private _orderdetail: OrderIdDetail, private _navparam: NavParams, private _popoverCtrl: PopoverController, private _viewCtrl: ViewController, private _apiService: ApiService) { }
    ngOnInit() {
        this.order_id = this._navparam.get("order_id");
         this._ngZone.run(() => {
        this.getOrderDetails(this.order_id);
         });
        this.events.subscribe('user:fcm', (orderid) => {
            console.log(orderid);
            this.showOrder = false;
            this._ngZone.run(() => {
                this.getOrderDetails(orderid);
            });
        });
    }

    close() {
        this._viewCtrl.dismiss();
    }
    getOrderDetails(order_id) {
        let body = {
            order_id: order_id
        }
        this.spin = true;
        this._orderdetail.getHomeProducts(body).then((res: any) => {
            this.orderid_detail = null;
            this.orderid_detail = res;
            this.orderid_detail.body.status = res['body'].status;
            this.spin = false;
            this.content.resize();
            // this._viewCtrl.fireWillEnter();
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
