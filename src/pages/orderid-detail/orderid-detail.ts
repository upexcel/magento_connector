import {Component, OnInit} from '@angular/core';
import {NavParams, ViewController, PopoverController} from 'ionic-angular';
import {ApiService} from './../../providers/api-service/api-service';
import {PopoverPage} from './../../components/popover/popover';
import { Storage } from '@ionic/storage';
import forEach from 'lodash/forEach';
import clone from 'lodash/clone';
import {OrderIdDetail} from './../../model/orderid-detail/orderid-detail';
@Component({
    templateUrl: 'orderid-detail.html'
})

export class OrderModalPage implements OnInit {
    order_no: number;
    order_id: number;
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
    bill_street: Array<string>;
    bill_country: string;
    bill_postcode: number;
    ship_fname: string;
    ship_lname: string;
    ship_telephone: number;
    ship_city: string;
    ship_region: string;
    ship_street: Array<string>;
    ship_country: string;
    ship_postcode: string;
    shipping_description: string;
    showOrder:boolean=false;
    showOrderError:boolean=false;
    constructor(private _orderdetail: OrderIdDetail, private _local: Storage, private _navparam: NavParams, private _popoverCtrl: PopoverController, private _viewCtrl: ViewController, private _apiService: ApiService) { }
    ngOnInit() {
        this.order_id = this._navparam.get("order_id");
        this._local.get('secret').then((value: any) => {
            this.getOrderDetails(this.order_id, value);
        });
    }
    close() {
        this._viewCtrl.dismiss();
    }
    getOrderDetails(order_id, secret) {
        let body = {
            order_id: order_id, secret: secret
        }
        this._orderdetail.getHomeProducts(body).then((res) => {
          if(res.message==''){
            this.showOrderError=true;
          }else{
            this.showOrder=true;
              this.status = res.data.status;
              this.grand_total = res.data.grand_total;
              this.purchased_on = res.data.purchased_on;
              this.item = res.data.items;
              this.payment_method = res.data.payment_method;
              var res_data: any = [];
              forEach(this.item, function(value, key) {
                  var datas = {
                      value: value,
                      key: key
                  };
                  res_data.push(datas);
              })
              this.items = clone(res_data);
              this.total_qty = res.data.total_qty_ordered;
              this.sub_total = res.data.base_grand_total;
              this.tax = res.data.tax_amount;
              this.shipping_amount = res.data.shipping_amount;
              this.bill_fname = res.data.billing_address.name;
              this.bill_lname = res.data.billing_address.lastname;
              this.bill_telephone = res.data.billing_address.telephone;
              this.bill_city = res.data.billing_address.city;
              this.bill_region = res.data.billing_address.region;
              this.bill_street = res.data.billing_address.street;
              this.bill_postcode = res.data.billing_address.postcode;
              this.bill_country = res.data.billing_address.county;
              this.ship_fname = res.data.shipping_address.name;
              this.ship_lname = res.data.shipping_address.lastname;
              this.ship_telephone = res.data.shipping_address.telephone;
              this.ship_city = res.data.shipping_address.city;
              this.ship_region = res.data.shipping_address.region;
              this.ship_street = res.data.shipping_address.street;
              this.ship_postcode = res.data.shipping_address.postcode;
              this.ship_country = res.data.shipping_address.county;
              this.shipping_method = res.data.shipping_method;
              this.shipping_description = res.data.shipping_description;
          }
        }).catch((err)=>{
          console.log(err);
        });
    }

    presentPopover(myEvent: any) {
        let popover = this._popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }

}
