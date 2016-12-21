import {Component, ViewChild} from '@angular/core';
import {ViewController, NavController, Nav} from 'ionic-angular';
import {StartPage} from './../../pages/startpage/startpage';
import {MySavedAddressPage} from './../../pages/myaccount/savedAddress';
import {ChangepasswordPage} from './../../pages/changePassword/changePassword';
import {OrderlistPage} from './../../pages/orderList/orderList';
import {LogoutService} from './../../providers/logout/logout-service';
import { Storage } from '@ionic/storage';
@Component({
    selector:'user-menu',
    templateUrl: 'popover.html'
})
export class PopoverPage {
    msg:string="";
    constructor(private _logout:LogoutService,private _local: Storage, private _viewCtrl: ViewController, private _navCtrl: NavController) {
    }
    close() {
        this._viewCtrl.dismiss();
    }
    gotoMyAccount() {
        this._navCtrl.push(MySavedAddressPage);
<<<<<<< HEAD
//          this.close();
    }
    gotoPass() {
        this._navCtrl.push(ChangepasswordPage);
//          this.close();
    }
    gotoOrders() {
        this._navCtrl.push(OrderlistPage);
//          this.close();
    }
    logout() {      
        this._logout.logout(this.msg,this._navCtrl);                  
//        this.close();
=======
    }
    gotoPass() {
        this._navCtrl.push(ChangepasswordPage);
    }
    gotoOrders() {
        this._navCtrl.push(OrderlistPage);
    }
    logout() {      
        this._logout.logout(this.msg,this._navCtrl);                  
>>>>>>> e74700487ce1a971c405f36905e0560abf701f5d
        this._navCtrl.setRoot(StartPage, { "message": this.msg });
    }
}