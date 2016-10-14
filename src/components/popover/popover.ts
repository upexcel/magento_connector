import {Component} from '@angular/core';
import {ViewController, NavController} from 'ionic-angular';
import {StartPage} from './../../pages/startpage/startpage';
import {MyaccountPage} from './../../pages/myaccount/myaccount';
import {ChangepasswordPage} from './../../pages/changepassword/changepassword';
import {OrderlistPage} from './../../pages/orderlist/orderlist';
import { Storage } from '@ionic/storage';
import {GooglePlus} from 'ionic-native'
@Component({
    templateUrl: 'popover.html'
})
export class PopoverPage {
    localRemove: any;
    constructor(public local: Storage, public viewCtrl: ViewController, public navCtrl: NavController) {
        this.localRemove = local;
    }

    close() {
        this.viewCtrl.dismiss();
    }
    gotomyaccount() {
        this.navCtrl.push(MyaccountPage);
    }
    gotopass() {
        this.navCtrl.push(ChangepasswordPage);
    }
    gotoorders() {
        this.navCtrl.push(OrderlistPage);
    }
    logout() {
                this.local.clear().then(() => {
                    this.navCtrl.push(StartPage);
                });
                GooglePlus.logout();
        //        this.local.remove('firstname');
        //        this.local.remove('lastname');
        //        this.local.remove('expiry');
        //        this.local.remove('access_token');
        //        this.local.remove('lists');
        //        this.local.remove('email');
//        this.local.clear();
//        this.navCtrl.push(StartPage);
    }
}



