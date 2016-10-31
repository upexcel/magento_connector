import {Component, OnInit} from '@angular/core';
import {NavParams, ViewController, PopoverController} from 'ionic-angular';
import {ApiService} from './../../providers/api-service/api-service';
import {PopoverPage} from './../../components/popover/popover';
import { Storage } from '@ionic/storage';
import forEach from 'lodash/forEach';
import clone from 'lodash/clone';
import {OrderIdDetail} from './../../model/orderid-detail/orderid-detail';
import { OrderIdDetailDataType } from './../../model/orderid-detail/orderid-detailData';
@Component({
    templateUrl: 'orderid-detail.html'
})

export class OrderModalPage implements OnInit {
    orderid_detail:OrderIdDetailDataType;
    order_id: number;
    item:any;
    items:any;
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
          this.orderid_detail=res;
          if(this.orderid_detail.message==''){
            this.showOrderError=true;
          }else{
            this.showOrder=true;
              this.item =  this.orderid_detail.data.items;
              var res_data: any = [];
              forEach(this.item, function(value, key) {
                  var datas = {
                      value: value,
                      key: key
                  };
                  res_data.push(datas);
              })
              this.items = clone(res_data);
          }
        }).catch((err)=>{
        });
    }

    presentPopover(myEvent: any) {
        let popover = this._popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }

}
