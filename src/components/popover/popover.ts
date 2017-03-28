import { Component } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';
import { StartPage } from './../../pages/startpage/startpage';
import { MySavedAddressPage } from './../../pages/myaccount/savedAddress';
import { ChangepasswordPage } from './../../pages/changePassword/changePassword';
import { OrderlistPage } from './../../pages/orderList/orderList';
import { LogoutService } from './../../providers/logout/logout-service';
import { MyEditAccount } from './../../pages/myaccount/myEditAccount';
import { Policy } from './../../pages/policies/policies';
import { AboutUs } from './../../pages/aboutUs/aboutUs';
import { ContactUs } from './../../pages/contactUs/contactUs';
@Component({
    selector: 'user-menu',
    templateUrl: 'popover.html'
})
export class PopoverPage {
    msg: string = "";
    constructor(private _logout: LogoutService, private _viewCtrl: ViewController, private _navCtrl: NavController) {
    }
    close() {
        this._viewCtrl.dismiss();
    }
    gotoMyAccount() {
        this._navCtrl.push(MySavedAddressPage);

    }
    gotoPass() {
        this._navCtrl.push(ChangepasswordPage);
    }
    gotoOrders() {
        this._navCtrl.push(OrderlistPage);
    }
    gotoEditAccount() {
        this._navCtrl.push(MyEditAccount);
    }
    gotoContactUs() {
        this._navCtrl.push(ContactUs);

    }
    gotoAboutUs() {
        this._navCtrl.push(AboutUs);
    }
    gotoPolicy() {
        this._navCtrl.push(Policy);

    }
    logout() {
        this._logout.logout(this.msg, this._navCtrl);
        this._navCtrl.setRoot(StartPage, { "message": this.msg });
    }
}