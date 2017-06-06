import { Component, OnInit } from '@angular/core';
import { ModalController, } from 'ionic-angular';
import { Events, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { HomeProductsDataType } from './../../model/home/homeProductsDataType';
import { HomeProducts } from '../../model/home/homeProducts';
import slice from 'lodash/slice';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';
import { MyAccount } from './../../model/myaccount/myaccount';
import { Address } from './../../providers/address-service/address';
import { WishListService } from './../../providers/wishList/wishList-service';
import { Storage } from '@ionic/storage';
import { CartFunction } from './../../model/cart/cartHandling';
import { ApiService } from './../../providers/api-service/api-service';
@Component({
    selector: 'home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {
    homeProduct: HomeProductsDataType;
    spin: boolean = false;
    feature_products: any;
    start: number = 0;
    end: number = 10;
    title: string = '';
    pagename: string = 'home';
    userToken: string;
    menu: boolean = true;
    c_Id;
    count = 0;
    constructor(public alertCtrl: AlertController, public _modalCtrl: ModalController, private _apiService: ApiService, private _cartFunction: CartFunction, public local: Storage, private _wishList: WishListService, private _address: Address, private _appDataConfigService: AppDataConfigService, private _myaccount: MyAccount, private _navParams: NavParams, private _events: Events, private _homeProductsConfig: HomeProducts, private _navCtrl: NavController, private _viewController: ViewController) {

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
        this._apiService.setNavControllerForService(this._navCtrl);
        setTimeout(() => {
            this._appDataConfigService.getUserData().then((userData: any) => {
                if (userData && userData.access_token) {
                    this._wishList.getWishListData({});
                    this._myaccount.getMyAccount({}).then((res) => {
                        this._address.setAddress(res);
                    }, (err) => { })
                }
            })
        }, 100);
        this._events.subscribe('api:review', (review) => {
            this.homeProducts();
        });
    }
    homeProducts(recoll?) {
        this.spin = true;
        let body = { "type": "full" }
        this._homeProductsConfig.getHomeProducts(body, recoll).then((res) => {
            if (res) {
                this.homeProduct = res;
                this.feature_products =this.homeProduct? slice(this.homeProduct.body, this.start, this.end) : [];
                this.spin = false;
            }
        })
    }
    ionViewWillEnter() {
        this._cartFunction.setCartData();
        this.count++;
        this.spin = true;
        let body = { "type": "full" }
        this._appDataConfigService.getUserData().then((userData: any) => {
            if (userData && userData.access_token && this.count == 1) {
                this.homeProducts(true);
            } else {
                this._homeProductsConfig.getHomeProducts(body).then((res) => {
                    if (res) {
                        this.spin = false;
                        this.homeProduct = res;
                        this.feature_products = this.homeProduct? slice(this.homeProduct.body, this.start, this.end) : [];
                    }
                });
            }
        })
    }

    doInfinite(infiniteScroll) {
    if(this.homeProduct){
        if (this.homeProduct.body.length % 2 == 0) {
            if (this.homeProduct.body.length > this.end) {
                setTimeout(() => {
                    this.end += 4;
                    this.feature_products =this.homeProduct? slice(this.homeProduct.body, this.start, this.end) : [];
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
                        this.feature_products =this.homeProduct? slice(this.homeProduct.body, this.start, this.end) :[];
                        infiniteScroll.complete();
                    }, 30);
                }
            }
            else {
                infiniteScroll.complete();
                infiniteScroll.enable(false);
            }
        }}

    }
    doRefresh(refresher) {
        this._appDataConfigService.removeFromLocalStorage('homeProducts').then((res) => {
            this.homeProducts();
            setTimeout(() => {
                refresher.complete();
            }, 2000);
        });
    }
}