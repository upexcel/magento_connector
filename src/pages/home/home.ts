import {Component, OnInit,ElementRef,Renderer} from '@angular/core';
import {Platform,ModalController,AlertController} from 'ionic-angular';
import {Events, NavController, NavParams, ViewController} from 'ionic-angular';
import {HomeProductsDataType} from './../../model/home/homeProductsDataType';
import {HomeProducts} from '../../model/home/homeProducts';
import slice from 'lodash/slice';
import {ToastService} from './../../providers/toast-service/toastService';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {MyAccount} from './../../model/myaccount/myaccount';
import {Address} from './../../providers/address-service/address';
import {WishListService} from './../../providers/wishList/wishList-service';
declare let navigator: any;
import {Storage} from '@ionic/storage';
import {CartFunction} from './../../model/cart/cartHandling';
import {ApiService} from './../../providers/api-service/api-service';
import { ModelService } from './../../providers/moniterModel/moniterModel';
declare let $:any;
@Component({
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {
    homeProduct: HomeProductsDataType;
    private el: ElementRef;
    spin: boolean = false;
    feature_products: any;
    start: number = 0;
    end: number = 4;
    backPressed: boolean = false;
    title: string = '';
    pagename: string = 'home';
    userToken: string;
    menu: boolean = true;
    c_Id;
    count = 0;
    constructor(public alertCtrl: AlertController,private _model: ModelService,public _modalCtrl: ModalController,private _apiService: ApiService, private _cartFunction: CartFunction, public local: Storage, private _wishList: WishListService, private _address: Address, private _appDataConfigService: AppDataConfigService, private _myaccount: MyAccount, private _navParams: NavParams, private _toast: ToastService, private _platform: Platform, private _events: Events, private _homeProductsConfig: HomeProducts, private _navCtrl: NavController, private _viewController: ViewController) {
    
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
                    }, (err) => {})
                }
            })
        }, 100)

        //        this.homeProducts();
        this.checkBackButton();
        this._events.subscribe('api:review', (review) => {
            this.homeProducts();
        });
    }
    homeProducts(recoll?) {
        this.spin = true;
        let body = {"type": "full"}
        this._homeProductsConfig.getHomeProducts(body, recoll).then((res) => {
            if (res) {
                this.homeProduct = res;
                this.feature_products = slice(this.homeProduct.body, this.start, this.end);
                this.spin = false;
            }
        })
    }
    ionViewWillEnter() {
        this._cartFunction.setCartData();
        this.count++;
        this.spin = true;
        let body = {"type": "full"}
        this._appDataConfigService.getUserData().then((userData: any) => {
            if (userData && userData.access_token && this.count == 1) {
                this.homeProducts(true);
            } else {
                this._homeProductsConfig.getHomeProducts(body).then((res) => {
                    if (res) {
                        this.spin = false;
                        this.homeProduct = res;
                        this.feature_products = slice(this.homeProduct.body, this.start, this.end);
                    }
                });
            }
        })
    }

    checkBackButton() {

        this._platform.registerBackButtonAction(() => {
            // console.log("_el", this.renderer.setElementStyle(this._el.nativeElement.querySelector('ion-alert'), 'display', 'none'));
            this._events.publish('user:exit', true);
            if (this._viewController.isLast() && this._viewController.isFirst()) {
                if (!this.backPressed) {
                    this.backPressed = true;
                    this._toast.toast('Press Again To Exit App', 3000);
                    setTimeout(() => this.backPressed = false, 2000);
                    return;
                } else {
                    navigator['app'].exitApp();
                }
            } else {
                   if(this._model.isActive()) {
                   /* closes modal */
                   this._model.modelData();
                   console.log("_modalCtrl")
               }else{
// window.history.back();
                //    if(this.alertCtrl){
                       console.log("enter if")
                //         // this.alertCtrl.dismiss();
                //          // $('ion-alert').css({'display':'none'});
                // this.alertCtrl =null; 
                      
                //    }else{
                //          console.log("pop")
                        this._navCtrl.pop();
                //    }
        
               }
               console.log("this._model.isActive()",this._model.isActive()); 
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
                    }, 30);
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
            setTimeout(() => {
                refresher.complete();
            }, 2000);
        });
    }
}