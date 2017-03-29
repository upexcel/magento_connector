import { Component } from '@angular/core';
import { ViewController, NavController, MenuController } from 'ionic-angular';
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
    constructor(private _menuCtrl: MenuController, private _logout: LogoutService, private _viewCtrl: ViewController, private _navCtrl: NavController) {
    }
    close() {
        this._viewCtrl.dismiss();
    }
    gotoMyAccount() {
        this._navCtrl.push(MySavedAddressPage);
        this._menuCtrl.close();
    }
    gotoPass() {
        this._navCtrl.push(ChangepasswordPage);
        this._menuCtrl.close();
    }
    gotoOrders() {
        this._navCtrl.push(OrderlistPage);
        this._menuCtrl.close();
    }
    gotoEditAccount() {
        this._navCtrl.push(MyEditAccount);
        this._menuCtrl.close();
    }
    gotoContactUs() {
        this._navCtrl.push(ContactUs);
        this._menuCtrl.close();
    }
    gotoAboutUs() {
        this._navCtrl.push(AboutUs);
        this._menuCtrl.close();
    }
    gotoPolicy() {
        this._navCtrl.push(Policy);
        this._menuCtrl.close();
    }
    logout() {
        this._logout.logout(this.msg, this._navCtrl);
        this._navCtrl.setRoot(StartPage, { "message": this.msg });
    }
}