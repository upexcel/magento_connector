import {Component, ViewChild} from '@angular/core';
import {ViewController, NavController, Nav} from 'ionic-angular';
import {StartPage} from './../../pages/startpage/startpage';
import {MyAccountPage} from './../../pages/myaccount/myaccount';
import {ChangepasswordPage} from './../../pages/changepassword/changepassword';
import {OrderlistPage} from './../../pages/orderlist/orderlist';
import { Storage } from '@ionic/storage';
import {GooglePlus} from 'ionic-native';
@Component({
    templateUrl: 'popover.html'
})
export class PopoverPage {
    constructor(public local: Storage, public viewCtrl: ViewController, public navCtrl: NavController) {
    }
    close() {
        this.viewCtrl.dismiss();
    }
    gotoMyAccount() {
        this.navCtrl.push(MyAccountPage);
    }
    gotoPass() {
        this.navCtrl.push(ChangepasswordPage);
    }
    gotoOrders() {
        this.navCtrl.push(OrderlistPage);
    }
    logout() {
                this.local.clear().then(() => {
                    this.navCtrl.push(StartPage);
                });
                GooglePlus.logout();
    }
}



