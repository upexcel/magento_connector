import {Component, ViewChild} from '@angular/core';
import {ViewController, NavController, Nav} from 'ionic-angular';
import {StartPage} from './../../pages/startpage/startpage';
import {MyAccountPage} from './../../pages/myaccount/myaccount';
import {ChangepasswordPage} from './../../pages/changepassword/changepassword';
import {OrderlistPage} from './../../pages/orderlist/orderlist';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
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
        this.navCtrl.push(MyAccountPage);
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
    }

}



