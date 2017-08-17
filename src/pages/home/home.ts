import {Component, OnInit} from '@angular/core';
import {ModalController, } from 'ionic-angular';
import {Events, NavController, NavParams, ViewController, AlertController} from 'ionic-angular';
import {HomeProductsDataType} from './../../model/home/homeProductsDataType';
import {HomeProducts} from '../../model/home/homeProducts';
import slice from 'lodash/slice';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {MyAccount} from './../../model/myaccount/myaccount';
import {Address} from './../../providers/address-service/address';
import {WishListService} from './../../providers/wishList/wishList-service';
import {CartFunction} from './../../model/cart/cartHandling';
import {ApiService} from './../../providers/api-service/api-service';
import {Slider} from './../../model/home/slider';
import {CategoryList} from '../../model/home/categoryList';
import {CMS} from '../../model/cms/cms';
import {NgZone} from '@angular/core';

@Component({
    selector: 'home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {
    homeProduct: HomeProductsDataType; //type checking
    spin: boolean = false;
    feature_products: any;
    start: number = 0;//item start
    end: number = 10; //item end
    title: string = ''; //page title
    pagename: string = 'home'; //page name
    userToken: string;//accesstocken
    menu: boolean = true; //show menu on header
    count = 0;
    updateSlider = false;
    categoryList = true;
    constructor(private _cms: CMS, private _categoryList: CategoryList, private _ngZone: NgZone, private _sliderService: Slider, public alertCtrl: AlertController, public _modalCtrl: ModalController, private _apiService: ApiService, private _cartFunction: CartFunction, private _wishList: WishListService, private _address: Address, private _appDataConfigService: AppDataConfigService, private _myaccount: MyAccount, private _navParams: NavParams, private _events: Events, private _homeProductsConfig: HomeProducts, private _navCtrl: NavController, private _viewController: ViewController) {

        this.userToken = this._navParams.data.access_token;
        if (this.userToken) { //check user login 
            this.pagename = 'home';
            this.title = 'Home';
        }
        else {
            this.title = 'Home';
        }
    }
    ngOnInit() {
        this._apiService.setNavControllerForService(this._navCtrl);//set refrence  of navCtrl
        this._events.subscribe('api:review', (review) => {
            this.homeProducts();
        });
    }
    homeProducts() {
        this._ngZone.run(() => {
            setTimeout(() => {
                this.updateSlider = true;
                this.categoryList = true;
            })
            this.spin = true;
            let body = {"type": "full"}
            this._homeProductsConfig.getHomeProducts(body).then((res: any) => { //call "home/products" api
                if (res) {
                    this.homeProduct = res;
                    //break product in page limit 
                    this.feature_products = this.homeProduct ? slice(this.homeProduct.body, this.start, this.end) : [];
                    this.spin = false;
                }
            })
        })
    }
    ionViewWillEnter() {
        this.homeProducts();
        this.count++;
        this.spin = true;
        this._appDataConfigService.getUserData().then((userData: any) => {
            if (userData && userData.access_token && this.count == 1) {
                this._cartFunction.setCartData().then((resp) => {
                }, (err) => {})
                this._wishList.getWishListData({});
                this._myaccount.getMyAccount({}).then((res) => {
                    this._address.setAddress(res);
                }, (err) => {
                    console.log("err", err)
                })
            } else if (this.count == 1) {
                this._cartFunction.setCartData().then((resp) => {
                }, (err) => {})
            }
        })
    }

    doInfinite(infiniteScroll) {
        if (this.homeProduct) {
            if (this.homeProduct.body.length % 2 == 0) {
                if (this.homeProduct.body.length > this.end) {
                    setTimeout(() => {
                        this.end += 4;
                        this.feature_products = this.homeProduct ? slice(this.homeProduct.body, this.start, this.end) : [];
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
                            this.feature_products = this.homeProduct ? slice(this.homeProduct.body, this.start, this.end) : [];
                            infiniteScroll.complete();
                        }, 30);
                    }
                }
                else {
                    infiniteScroll.complete();
                    infiniteScroll.enable(false);
                }
            }
        }
    }
    doRefresh(refresher) {
        this._ngZone.run(() => {
            this._sliderService.resetSlider();
            this._homeProductsConfig.resetHomeProducts();
            this._cms.resetStaticPageList();
            this._categoryList.resetCategoryList();
            this.updateSlider = false;
            this.categoryList = false;
        });
        this.homeProducts();
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
}