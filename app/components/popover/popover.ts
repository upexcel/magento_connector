import {Component} from '@angular/core';
import {ViewController, NavController} from 'ionic-angular'
//import {LoginPage} from './../../pages/login/login'
import {StartPage} from './../../pages/startpage/startpage'
import {MyaccountPage} from './../../pages/myaccount/myaccount'
import {ChangepasswordPage} from './../../pages/changepassword/changepassword'
import {OrderlistPage} from './../../pages/orderlist/orderlist'
import {GooglePlus, Facebook, SpinnerDialog} from 'ionic-native'
@Component({
    template: `
    <ion-list  no-lines>
      <ion-list-header>Profile</ion-list-header>
      <button ion-item (click)="gotomyaccount()"> <ion-icon name="contact" item-left></ion-icon>My Account</button>
     <button ion-item (click)="gotopass()"> <ion-icon name="key" item-left></ion-icon>Change Password</button>
 <button ion-item (click)="gotoorders()"> <ion-icon name="analytics" item-left></ion-icon>My Orders</button>
<button ion-item (click)="logout()"> <ion-icon name="exit" item-left></ion-icon>Logout</button>

    </ion-list>
  `
})
export class PopoverPage {
    constructor(private viewCtrl: ViewController, private navCtrl: NavController) { }

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
        this.navCtrl.setRoot(OrderlistPage);
    }
    logout() {
        localStorage.removeItem('firstname');
        localStorage.removeItem('lastname');
        localStorage.removeItem('expiry');
        localStorage.removeItem('access_token');
        localStorage.removeItem('lists');
        localStorage.removeItem('email');
        localStorage.removeItem('secret');
        GooglePlus.logout();
        this.navCtrl.setRoot(StartPage);
    }
}



