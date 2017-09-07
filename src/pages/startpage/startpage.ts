import {Component, OnInit} from '@angular/core';
import {ModalController, NavController, NavParams, AlertController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {TourPage} from '../takeTour/tour';
import {Storage} from '@ionic/storage';
import {AppConfig} from '../../model/appConfig/appConfig';
import {config} from './../../providers/config/config';
import {SocialService} from '../../providers/social-service/social-service';
import {HomePage} from '../../pages/home/home';
import {SocialAccountDataType} from '../../model/startPage/socialAccountDataType';
import {SocialAccount} from './../../model/startPage/socialAccount';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {CategoryList} from './../../model/home/categoryList';
import {HomeProducts} from '../../model/home/homeProducts';
import {Slider} from './../../model/home/slider';
import {MyAccount} from './../../model/myaccount/myaccount';
import {WishListService} from './../../providers/wishList/wishList-service';
import {Address} from './../../providers/address-service/address';
import {CartFunction} from '../../model/cart/cartHandling';
import {CartService} from './../../providers/cart-service/cart-service';
import {ToastService} from './../../providers/toast-service/toastService';
import {fcmService} from './../../providers/fcm-service/fcm-service';
import {EventService} from './../../providers/headerEvents/headerEvents';

@Component({
    selector: 'start-page',
    templateUrl: 'startpage.html'
})
export class StartPage implements OnInit {
    // data: ConfigDataType;
    data: any;
    socialData: SocialAccountDataType;
    messsage_expired: string;
    check: boolean = false;
    options: {};
    spin = {};
    visible: boolean = true;
    constructor(public _eventService: EventService,private _fcmService: fcmService, private _toast: ToastService, private _cartFunction: CartFunction, private _address: Address, private _wishList: WishListService, private _myaccount: MyAccount, private _cartService: CartService, private _sliderService: Slider, private _homeProductsConfig: HomeProducts, private _categoryService: CategoryList, private _socialAccount: SocialAccount, private _appConfig: AppConfig, public _local: Storage, public _socialProvider: SocialService, private _alertCtrl: AlertController,
        private _navCtrl: NavController, private _navparam: NavParams,
        private _modelCtrl: ModalController, private _appConfigService: AppDataConfigService) {
        this.spin = {google: "1", facebook: "1"};
    }

    ngOnInit() {
        this.messsage_expired = this._navparam.get("message");// get expire message
        this.options = {    //  get value from config 
            clientid: config.google_clientid
        }
        if (this.messsage_expired){
            this._address.resetAddress();
            this._cartFunction.resetCart();
            this._eventService.setWishList(0);
            this._eventService.setCartCounter(0);
        }
        this._appConfigService.resetDataInService();//reset data from service
        this._appConfig.getAppConfig().then((res) => { // get data from local
            this.data = res;
            this._local.set('website_id', this.data.body.website_id);//set website_id on local storage
            this._local.set('store_id', this.data.body.store_id);//set store_id on local storage
            this._local.set('require_login', this.data.body.store_id);//set require_login on local storage
            this._categoryService.getCategoryList();
            this._sliderService.getSlider();
            this.check = true;
            this._homeProductsConfig.resetHomeProducts();
            setTimeout(() => {this._homeProductsConfig.getHomeProducts();}, 300)
        })
            .catch((err) => {
                this.showSocialLoginError(err);
            });
    }
    gotologin() {
        this._navCtrl.push(LoginPage);//move to Login Page
    }
    presentProfileModal() {
        let profileModal = this._modelCtrl.create(TourPage);
        profileModal.present();
    }
    commanApiCall() {
        setTimeout(() => {
            this._fcmService.saveFCMTokenOnServer();
            this._homeProductsConfig.resetHomeProducts();
            this._homeProductsConfig.getHomeProducts();
            this._wishList.getWishListData({});
            this._cartFunction.setCartData().then((resp) => {
            }, (err) => {})
            this._myaccount.getMyAccount({}).then((res) => {
                this._address.setAddress(res);
            }, (err) => {
            })
        })
    }
    /**
    * userFbLogin
    *
    * Use of this source code is to facebook login and move page to home page
    **/
    userFbLogin(body) {
        this._socialAccount.getSocialAccount(body.data).then((res: any) => {
            this.socialData = res;
            this.visible = false;
            setTimeout(() => {
                this.spin['facebook'] = false;
                this.visible = true;
            }, 100);
            this._toast.toast("Welcome " + body.data.firstname, 3000);
            res.body['login'] = "social";
            this._appConfigService.setUserData(res.body);
            this._navCtrl.setRoot(HomePage, {"access_token": res.body.access_token}).then(() => {
                this.commanApiCall();
            });
        });
    }
    /**
    * userGoogleLogin
    *
    * Use of this source code is to google login and move page to home page
    **/
    userGoogleLogin(body) {
        this._socialAccount.getSocialAccount(body).then((res: any) => {
            this.socialData = res;
            res.body['login'] = "social";
            this.visible = false;
            setTimeout(() => {
                this.spin['google'] = false;
                this.visible = true;
            }, 100);
            this._appConfigService.setUserData(res.body);
            this._toast.toast("Welcome " + body.firstname, 3000);
            this._navCtrl.setRoot(HomePage, {"access_token": res.body.access_token}).then(() => {
                this.commanApiCall();
            });
        });
    }
    showSocialLoginError(error) {
        let alert = this._alertCtrl.create({
            title: 'Error',
            subTitle: error,
            buttons: ['OK']
        });
        alert.present();
    }
}
