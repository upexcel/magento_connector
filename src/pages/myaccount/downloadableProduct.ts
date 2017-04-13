import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {OrderModalPage} from '../orderid-detail/orderid-detail';
import {MyDownlodeData} from './../../model/myaccount/myDownloadableProduct';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import forEach from 'lodash/forEach';
@Component({
   selector: 'my-download',
   templateUrl: 'download.html'
})
export class Downloadable {
   spin: boolean= true;
   myDownloadableData:any;
   constructor(public _navCtrl: NavController, public _myDownlodeData: MyDownlodeData, private _appConfigService: AppDataConfigService) {}
   ngOnInit(){
       this.spin = true;
       this._appConfigService.getUserData().then((userData: any) => {
            let secret = userData ? userData['secret'] : "";
            this._myDownlodeData.getMyDownlodeData({"secret": secret}).then((res:any) => {
                forEach(res['body'], (value, key) => {
                    value['date'] = (value.created_at.split(" "))[0];
                    value['time'] = (value.created_at.split(" "))[1];
                });
                this.myDownloadableData = res['body'];
                this.spin = false;
            })
        });
   }
   viewOrderDetail(orderId) {
       this._navCtrl.push(OrderModalPage, {"order_id": orderId});
   }
}