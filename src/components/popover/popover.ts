import {Component, ViewChild} from '@angular/core';
import {ViewController, NavController, Nav} from 'ionic-angular';
import {StartPage} from './../../pages/startpage/startpage';
import {MyaccountPage} from './../../pages/myaccount/myaccount';
import {ChangepasswordPage} from './../../pages/changepassword/changepassword';
import {OrderlistPage} from './../../pages/orderlist/orderlist';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
@Component({
    templateUrl: 'popover.html'
})
export class PopoverPage {
    @ViewChild(Nav) nav: Nav;
    constructor(public events: Events, public local: Storage, public viewCtrl: ViewController, public navCtrl: NavController) {

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
        this.local.remove('firstname');
        this.local.remove('lastname');
        this.local.remove('expiry');
        this.local.remove('access_token');
        this.local.remove('lists');
         this.navCtrl.push(StartPage);

    }
//    function createUser(user) {
//    console.log('User created!')
//    events.publish('user:created', user);
//}

}



