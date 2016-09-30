import { Component, OnInit} from '@angular/core';
import { NavController, PopoverController, ModalController, AlertController } from 'ionic-angular';
import {FormService} from './../../providers/form-service/form-service'
import {PopoverPage} from './../../components/popover/popover';
import {OrderModalPage} from './../orderid-detail/orderid-detail'
import * as _ from 'lodash'
import * as moment from 'moment';
import {CalendarPipe, DateFormatPipe, TimeAgoPipe} from 'angular2-moment'
@Component({
    templateUrl: 'build/pages/orderlist/orderlist.html',
    providers: [FormService],
    pipes: [CalendarPipe, DateFormatPipe, TimeAgoPipe]
})
export class OrderlistPage implements OnInit {
    firstname: any;
    lastname: any;
    totalOrders: any;
    totalAmount: any;
    ttl_show: boolean = false;
    res: any;
    values: any;
    color_name: any;
    dates: any = [];
    datess: any = [];
    orders_error: any;
    secret: any;
    access_token: any;
    no_orders: boolean = false;
    currentDateMoment: any;
    dates_values: any;
    todays_date: any;
    public event = {
        timeStarts: '',
        timeEnds: ''
    }
    constructor(public alertCtrl: AlertController, public modalCtrl: ModalController, private navCtrl: NavController, public popoverCtrl: PopoverController, private _formService: FormService) {
        this.firstname = localStorage.getItem('firstname');
        this.lastname = localStorage.getItem('lastname');
        this.secret = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcHAubWFnZW50by5leGNlbGxlbmNlIiwiYXVkIjoibW9iaWxlX2FwcCJ9.R4eQ8HCunGPktBEMAVpt6B5IDFGrvgTEuzCKnsykQEY";
    }
    ngOnInit() {
        this.selectedOrder_details();
        this.total_orders();
    }
    get_orders() {

        this.selectedOrder_details();
    }
    selectedOrder_details() {
//        console.log(this.event.timeStarts + " " + this.event.timeEnds)
        var date: any = [];
        var body = { "secret": this.secret }
        this._formService.api("order/alllist", body).subscribe((res) => {
            if (res.status == 0) {
                this.showAlert();
            }
            if (JSON.parse(res.body).data == 0) {
                this.no_orders = true;
                this.orders_error = "You have no orders from these dates";

            } else {
                this.res = JSON.parse(res.body).data;
                console.log(this.res)
                var res_data: any = [];
                _.forEach(this.res, function(value, key) {
                    date.push(value.created_at.split(" ", 1));
                    var datas = {
                        value: value,
                        key: key
                    };
                    res_data.push(datas);
                });
                this.values = _.reverse(_.clone(res_data));
                this.dates = _.reverse(_.uniq(_.flattenDeep(date)));
            }
        })
    }
    total_orders() {
        var body = { "secret": this.secret }
        console.log(body)
        this._formService.api("order/totalorder", body).subscribe((res) => {
            if (JSON.parse(res.body).data != 0) {
                this.ttl_show = true;
                this.totalOrders = JSON.parse(res.body).data.total_order;
                this.totalAmount = JSON.parse(res.body).data.total_amount;
            } else {
                console.log(JSON.parse(res.body).data)
            }

        })
    }
    presentPopover(myEvent: any) {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }

    presentModal(id: any) {
        console.log(id)
        this.navCtrl.push(OrderModalPage, { "order_id": id });
    }
    showAlert() {
        let alert = this.alertCtrl.create({
            title: 'Warning',
            subTitle: 'Select Start Date or End Date to get orders details',
            buttons: ['OK']
        });
        alert.present();
    }
}
