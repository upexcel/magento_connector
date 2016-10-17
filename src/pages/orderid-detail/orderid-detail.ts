import {Component, OnInit} from '@angular/core';
import {NavParams, ViewController, PopoverController} from 'ionic-angular';
import {ApiService} from './../../providers/api-service/api-service';
import {PopoverPage} from './../../components/popover/popover';
import { Storage } from '@ionic/storage';
import forEach from 'lodash/forEach';
import clone from 'lodash/clone';
@Component({
    templateUrl: 'orderid-detail.html'
})

export class OrderModalPage implements OnInit {
    order_no: number;
    order_id: number;
    secret: any;
    customer_name: string;
    customer_email: string;
    purchased_on: any;
    grand_total: number;
    item: any;
    status: string;
    shipping_method: string;
    payment_method: string;
    state: string;
    total_qty: number;
    sub_total: number;
    orders: string = "order_id";
    items: any = [];
    tax: number;
    shipping_amount: number;
    bill_fname: string;
    bill_lname: string;
    bill_telephone: number;
    bill_city: string;
    bill_region: string;
    bill_street: string;
    bill_country: string;
    bill_postcode: number;
    ship_fname: string;
    ship_lname: string;
    ship_telephone: number;
    ship_city: string;
    ship_region: string;
    ship_street: string;
    ship_country: string;
    ship_postcode: number;
    shipping_description: string;
    constructor(private _local: Storage, private _navparam: NavParams, private _popoverCtrl: PopoverController, private _viewCtrl: ViewController, private _apiService: ApiService) { }
    ngOnInit() {
        this.order_id = this._navparam.get("order_id");
        this._local.get('secret').then((value: any) => {
            this.secret = value;
            this.getOrderDetails(this.order_id);
        });
    }
    close() {
        this._viewCtrl.dismiss();
    }
    getOrderDetails(order_id: any) {
        let body = {
            order_id: order_id, secret: this.secret
        }
        this._apiService.api("order/get/", body).subscribe((res) => {
            let parse = JSON.parse(res.body);
            this.status = parse.data.status;
            this.grand_total = parse.data.grand_total;
            this.purchased_on = parse.data.purchased_on;
            this.item = parse.data.items;
            this.payment_method = parse.data.payment_method;
            var res_data: any = [];
            forEach(this.item, function(value, key) {
                var datas = {
                    value: value,
                    key: key
                };
                res_data.push(datas);
            })
            this.items = clone(res_data);
            this.total_qty = parse.data.total_qty_ordered;
            this.sub_total = parse.data.base_grand_total;
            this.tax = parse.data.tax_amount;
            this.shipping_amount = parse.data.shipping_amount;
            this.bill_fname = parse.data.billing_address.name;
            this.bill_lname = parse.data.billing_address.lastname;
            this.bill_telephone = parse.data.billing_address.telephone;
            this.bill_city = parse.data.billing_address.city;
            this.bill_region = parse.data.billing_address.region;
            this.bill_street = parse.data.billing_address.street;
            this.bill_postcode = parse.data.billing_address.postcode;
            this.bill_country = parse.data.billing_address.county;
            this.ship_fname = parse.data.shipping_address.name;
            this.ship_lname = parse.data.shipping_address.lastname;
            this.ship_telephone = parse.data.shipping_address.telephone;
            this.ship_city = parse.data.shipping_address.city;
            this.ship_region = parse.data.shipping_address.region;
            this.ship_street = parse.data.shipping_address.street;
            this.ship_postcode = parse.data.shipping_address.postcode;
            this.ship_country = parse.data.shipping_address.county;
            this.shipping_method = parse.data.shipping_method;
            this.shipping_description = parse.data.shipping_description;
        });
    }

    presentPopover(myEvent: any) {
        let popover = this._popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }

}