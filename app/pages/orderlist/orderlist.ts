import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FormService} from './../../providers/form-service/form-service'
import * as _ from 'lodash'
@Component({
    templateUrl: 'build/pages/orderlist/orderlist.html',
    providers: [FormService]
})
export class OrderlistPage implements OnInit {
    firstname: any
    lastname: any
    orders: string = "order_details";
    res: any
    values: any
    color_name: any
    constructor(private navCtrl: NavController, private _formService: FormService) {
        this.firstname = localStorage.getItem('firstname')
        this.lastname = localStorage.getItem('lastname')
    }
    ngOnInit() {
        this.selectedOrder_details();
    }
    selectedTotal_orders() {
        console.log("selectedTotal_orders")
    }
    selectedTotal_amount() {
        console.log("selectedTotal_amount")
    }
    selectedOrder_details() {
        console.log("selectedOrder_details")
        var body = { "to": "2016-05-02", "from": "2016-08-05", "limit": "10" }
        this._formService.api("order/alllist", body).subscribe((res) => {
            this.res = JSON.parse(res.body).data;
            var res_data: any = [];
            _.forEach(this.res, function(value, key) {
                var datas = {
                    value: value,
                    key: key
                };
                res_data.push(datas);
            });
            this.values = _.reverse(_.clone(res_data));
            console.log(this.values)
        })
    }
}
