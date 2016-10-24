import {Component, ViewChild} from '@angular/core';
import {ViewController, NavController, Nav} from 'ionic-angular';
import {StartPage} from './../../pages/startpage/startpage';
import {MyAccountPage} from './../../pages/myaccount/myaccount';
import {ChangepasswordPage} from './../../pages/changePassword/changePassword';
import {OrderlistPage} from './../../pages/orderList/orderList';
import { Storage } from '@ionic/storage';
@Component({
    templateUrl: 'popover.html'
})
export class PopoverPage {
    constructor(private _local: Storage, private _viewCtrl: ViewController, private _navCtrl: NavController) {
    }
    close() {
        this._viewCtrl.dismiss();
    }
    gotoMyAccount() {
        this._navCtrl.push(MyAccountPage);
    }
    gotoPass() {
        this._navCtrl.push(ChangepasswordPage);
    }
    gotoOrders() {
        this._navCtrl.push(OrderlistPage);
    }
    logout() {
        this._local.clear().then(() => {
            this._navCtrl.push(StartPage);
        });
    }
}
