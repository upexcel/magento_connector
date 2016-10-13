import {Component, OnInit} from '@angular/core';
import {NavParams, ViewController, PopoverController} from 'ionic-angular';
import {FormService} from './../../providers/form-service/form-service';
import {PopoverPage} from './../../components/popover/popover';
import { Storage } from '@ionic/storage';
import  _ from 'lodash';
@Component({
    templateUrl: 'orderid-detail.html'
})

export class OrderModalPage implements OnInit {
    order_no: any;
    order_id: any;
    secret: any;
    customer_name: any;
    customer_email: any;
    purchased_on: any;
    grand_total: any;
    item: any;
    status: any;
    shipping_method: any;
    payment_method: any;
    state: any;
    total_qty: any;
    sub_total: number;
    orders: string = "order_id";
    items: any = [];
    tax: number;
    shipping_amount: number;
    bill_fname: any;
    bill_lname: any;
    bill_telephone: any;
    bill_city: any;
    bill_region: any;
    bill_street: any;
    bill_country: any;
    bill_postcode: any;
    ship_fname: any;
    ship_lname: any;
    ship_telephone: any;
    ship_city: any;
    ship_region: any;
    ship_street: any;
    ship_country: any;
    ship_postcode: any;
    shipping_description: any;
    constructor(public local: Storage, public navparam: NavParams, public popoverCtrl: PopoverController, private viewCtrl: ViewController, private _formService: FormService) {
        //        this.order_no = navparam.get("order_no");
        this.order_id = navparam.get("order_id");
         this.local.get('secret').then((value: any) => {
         this.secret =  value;
         this.getOrderDetails(this.order_id);
         });
    }
    ngOnInit() {
        
    }
    close() {
        this.viewCtrl.dismiss();
    }
    getOrderDetails(order_id: any) {
        var body = {
            order_id: order_id, secret: this.secret
        }
        this._formService.api("order/get/", body).subscribe((res) => {
            var parse=JSON.parse(res.body);
            this.status = parse.data.status;
            this.grand_total = parse.data.grand_total;
            this.purchased_on = parse.data.purchased_on;
            this.item = parse.data.items;
            this.payment_method = parse.data.payment_method;
            var res_data: any = [];
            _.forEach(this.item, function(value, key) {
                var datas = {
                    value: value,
                    key: key
                };
                res_data.push(datas);
            })
            this.items = _.clone(res_data);
            this.total_qty = parse.data.total_qty_ordered;
            this.sub_total = parse.data.base_grand_total;
            this.tax = parse.data.tax_amount;
            this.shipping_amount = parse.data.shipping_amount;
            this.bill_fname =parse.data.billing_address.name;
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
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }

}