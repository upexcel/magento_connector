import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Events, NavController, NavParams, ViewController } from 'ionic-angular';
import { HomeProductsDataType } from './../../model/home/homeProductsDataType';
import { HomeProducts } from '../../model/home/homeProducts';
import slice from 'lodash/slice';
import { ToastService } from './../../providers/toast-service/toastService';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';
import { MyAccount } from './../../model/myaccount/myaccount';
import { Address } from './../../providers/address-service/address';
import { LogoutService } from './../../providers/logout/logout-service';
import { StartPage } from './../../pages/startpage/startpage';
import { WishListService } from './../../providers/wishList/wishList-service';
declare let navigator: any;

@Component({
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {
    homeProduct: HomeProductsDataType;
    spin: boolean = false;
    feature_products: any;
    start: number = 0;
    end: number = 4;
    backPressed: boolean = false;
    title: string = '';
    pagename: string = 'home';
    userToken: any;
    menu: boolean = true;
    c_Id;
    constructor(private _wishList: WishListService, private _logout: LogoutService, private _address: Address, private _appDataConfigService: AppDataConfigService, private _myaccount: MyAccount, private _navParams: NavParams, private _toast: ToastService, private _platform: Platform, private _events: Events, private _homeProductsConfig: HomeProducts, private _navCtrl: NavController, private _viewController: ViewController) {

        this.userToken = this._navParams.data.access_token;
        if (this.userToken) {
            this.pagename = 'home';
            this.title = 'Home';
        }
        else {
            this.title = 'Home';
        }
    }
    ngOnInit() {
        setTimeout(() => {
            this._appDataConfigService.getUserData().then((userData: any) => {
                if (userData && userData.access_token) {
                    this._wishList.getWishListData({ "secret": userData.secret });
                    this._myaccount.getMyAccount({ "secret": userData.secret }).then((res) => {
                        this._address.setAddress(res);
                    }, (err) => {
                        this._logout.logout("please Login Again", this._navCtrl);
                        this._navCtrl.setRoot(StartPage, { "message": "please Login Again" });
                    })
                }
            })
        }, 100)

//        this.homeProducts();
        this.checkBackButton();
        this._events.subscribe('api:review', (review) => {
            this.homeProducts();
        });
    }
    homeProducts() {
        this.spin = true;
        let body = { "type": "full" }
        this._homeProductsConfig.getHomeProducts(body).then((res) => {
            if (res) {
                this.homeProduct = res;
                this.feature_products = slice(this.homeProduct.body, this.start, this.end);
                this.spin = false;
            }
        })
    }
    ionViewWillEnter() {
        let body = {"type": "full"}
        this._homeProductsConfig.getHomeProducts(body).then((res) => {
            if (res) {
                this.homeProduct = res;
                this.feature_products = slice(this.homeProduct.body, this.start, this.end);
            }
        });
    }

    checkBackButton() {
        this._platform.registerBackButtonAction(() => {
            this._events.publish('user:exit', true);
            if (this._viewController.isLast() && this._viewController.isFirst()) {
                if (!this.backPressed) {
                    this.backPressed = true;
                    this._toast.toast('Press Again For Exit App', 3000);
                    setTimeout(() => this.backPressed = false, 2000);
                    return;
                } else {
                    navigator['app'].exitApp();
                }
            } else {
                this._navCtrl.pop();
            }
        }, 100);
    }
    doInfinite(infiniteScroll) {
        if (this.homeProduct.body.length % 2 == 0) {
            if (this.homeProduct.body.length > this.end) {
                setTimeout(() => {
                    this.end += 4;
                    this.feature_products = slice(this.homeProduct.body, this.start, this.end);
                    infiniteScroll.complete();
                }, 100);
            } else {
                infiniteScroll.complete();
                infiniteScroll.enable(false);
            }
        }
        else {
            let check = this.homeProduct.body.length + 1;
            if (check >= this.end) {
                if (check <= this.end) {
                    infiniteScroll.complete();
                    infiniteScroll.enable(false);
                }
                else {
                    setTimeout(() => {
                        this.end += 4;
                        this.feature_products = slice(this.homeProduct.body, this.start, this.end);
                        infiniteScroll.complete();
                    }, 100);
                }
            }
            else {
                infiniteScroll.complete();
                infiniteScroll.enable(false);
            }
        }

    }
    doRefresh(refresher) {
        this._appDataConfigService.removeFromLocalStorage('homeProducts').then((res) => {
            this.homeProducts();
            refresher.complete();
        });
    }
}