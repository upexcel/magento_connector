import {Component} from '@angular/core';
import {ViewController, NavController, MenuController, Events} from 'ionic-angular';
import {StartPage} from './../../pages/startpage/startpage';
import {MySavedAddressPage} from './../../pages/myaccount/savedAddress';
import {ChangepasswordPage} from './../../pages/changePassword/changePassword';
import {OrderlistPage} from './../../pages/orderList/orderList';
import {LogoutService} from './../../providers/logout/logout-service';
import {MyEditAccount} from './../../pages/myaccount/myEditAccount';
import {cmsPages} from './../../pages/cmsPages/cmsPages';
import {ContactUs} from './../../pages/contactUs/contactUs';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {Downloadable} from './../../pages/myaccount/downloadableProduct';
import {MyReviews} from './../../pages/myaccount/myReviews';
import {CMS} from './../../model/cms/cms';

@Component({
    selector: 'user-menu',
    templateUrl: 'popover.html'
})
/*
*this componet is use to redirect page 
*/
export class PopoverPage {
    msg: string = "";
    usermenu: boolean;
    loginWith: boolean = false;
    staticPagesList: any;
    constructor(public _cms: CMS, private _events: Events, private _appConfigService: AppDataConfigService, private _menuCtrl: MenuController, private _logout: LogoutService, private _viewCtrl: ViewController, private _navCtrl: NavController) {
        this.tokenCheck();
        this._events.subscribe('check:loginSideMenu', (data) => {
            this.tokenCheck();
            this._events.unsubscribe('check:loginSideMenu');
        });
        this.getStaticPageList();
    }
    /*
     * this function is use for get static page list
     */
    getStaticPageList() {
        this._cms.getStaticPageList().then((res) => {
            this.staticPagesList = res['body'];
        }, (err) => {
        })
    }

    gotoPage(pageDetails) {
        this._navCtrl.push(cmsPages, {pageDetails});
        this._menuCtrl.close();
    }
    /*
     * this function is use for check authorization 
     */
    tokenCheck() {
        this._appConfigService.getUserData().then((userData: any) => {
            if (userData != null) {
                this.usermenu = true;
                if (userData['login'] == "normal") {
                    this.loginWith = true;
                } else {
                    this.loginWith = false;
                }
            } else {
                this.usermenu = false;
            }
        });
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
    gotoDownloadable() {
        this._navCtrl.push(Downloadable);
        this._menuCtrl.close();
    }
    gotoMyReview() {
        this._navCtrl.push(MyReviews);
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
    logout() {
        this._logout.logout(this.msg, this._navCtrl);
        this._navCtrl.setRoot(StartPage, {"message": this.msg});
    }
}