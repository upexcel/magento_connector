import {Component, OnInit, ViewChild} from '@angular/core';
import {Platform, NavController, Events, IonicApp, App} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {StartPage} from '../pages/startpage/startpage';
import {HomePage} from '../pages/home/home';
import {Storage} from '@ionic/storage';
import {AppDataConfigService} from '../providers/appdataconfig/appdataconfig';
import {OfflinePage} from '../pages/offline/offline';
import {Splashscreen} from 'ionic-native';
import {Firebase} from '@ionic-native/firebase';
import {LocalNotifications} from '@ionic-native/local-notifications';
import {fcmService} from '../providers/fcm-service/fcm-service';
import {OrderModalPage} from '../pages/orderid-detail/orderid-detail';
import {ToastService} from '../providers/toast-service/toastService';
import {Keyboard} from '@ionic-native/keyboard';
import {Network} from '@ionic-native/network';
import {CartService} from '../providers/cart-service/cart-service';
import {MyAccount} from '../model/myaccount/myaccount';
import {WishListService} from '../providers/wishList/wishList-service';
import {Address} from '../providers/address-service/address';
import {CartFunction} from '../model/cart/cartHandling';
import {Slider} from '../model/home/slider';
import {Country} from '../model/myaccount/country';
declare let navigator: any;

@Component({
    template: `<ion-nav #myNav [root]="_rootPage"></ion-nav>
   `
})

export class MyApp implements OnInit {
    @ViewChild('myNav') nav: NavController
    public _rootPage: any;
    backPressed: boolean = false;
    rootPageName: string;
    constructor(private _country: Country, private _sliderService: Slider, private _address: Address, private _wishList: WishListService, private _myaccount: MyAccount, private _cartService: CartService, private _cartFunction: CartFunction, private statusBar: StatusBar, public network: Network, public keyboard: Keyboard, private _toast: ToastService, private app: App, private ionicApp: IonicApp, public events: Events, private _fcmService: fcmService, private localNotifications: LocalNotifications, private firebase: Firebase, private _platform: Platform, private _local: Storage, private _appConfigService: AppDataConfigService) {
        this._platform.ready().then(() => {
            // this.keyboard.hideKeyboardAccessoryBar(false);
            this.hideSplashScreen();
            this.addConnectivityListeners();
            this._fcmService.initFCM();
            this.fcm();
            this.checkBackButton();
            this.localNotifications.on("click", (data) => {
                setTimeout(() => {
                    this.nav.push(OrderModalPage, {order_id: data['data']});
                }, 100)
            })
        });
        //event comes from tour page when skip button click
        this.events.subscribe('goHome:home', () => {
            if (this.rootPageName == 'HomePage') {
                this.nav.setRoot(HomePage);
            } else {
                this._rootPage = HomePage;
                this.rootPageName = 'HomePage';
            }
        })
    }
    ngOnDestroy() {
        this.events.unsubscribe('goHome:home');
    }
    /**
    *checkBackButton
    *use when back button click (handle back button event)
    **/
    checkBackButton() {
        this._platform.registerBackButtonAction(() => {
            let ready = true;
            if (this.nav.canGoBack()) {
                let activePortal = this.ionicApp._loadingPortal.getActive() ||
                    this.ionicApp._modalPortal.getActive() ||
                    this.ionicApp._toastPortal.getActive() ||
                    this.ionicApp._overlayPortal.getActive();
                if (activePortal) {
                    ready = false;
                    var refVar = activePortal;
                    activePortal.dismiss();
                    activePortal = refVar;
                    //                    activePortal.onDidDismiss(() => {ready = true;});
                } else {
                    this.nav.pop();
                }
            } else {
                if (!this.backPressed) {
                    this.backPressed = true;
                    this._toast.toast('Press Again To Exit App', 3000);
                    setTimeout(() => this.backPressed = false, 2000);
                    return;
                } else {
                    navigator['app'].exitApp();
                }
            }
        }, 100);
    }
    /**
    *hideSplashScreen
    * use for Splashscreen hide
    **/
    hideSplashScreen() {
        setTimeout(() => {
            Splashscreen.hide();
        }, 500);
    }
    ngOnInit() {
        this._platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.appCheckConfig();
        });
    }
    /**
*appCheckConfig
*redirect page as root page 
**/
    appCheckConfig() {
        this._local.get("web_config").then((web_config) => {
            if (web_config == null) {
                this._rootPage = StartPage;
                this.rootPageName = 'StartPage';
                this._country.getCountryName();
            }
            else {
                this._appConfigService.cleanUp();
                this._appConfigService.getUserData().then((userData) => {
                    if (userData !== null) {
                        this._wishList.getWishListData({});
                        this._cartFunction.setCartData().then((resp) => {
                        }, (err) => {})
                        this._myaccount.getMyAccount({}).then((res) => {
                            this._address.setAddress(res);
                        }, (err) => {
                        })
                    }
                    this._rootPage = HomePage;
                    this.rootPageName = 'HomePage'; 
                })

            }
        });
        this._appConfigService.getUserData().then((userData) => {
            if (userData !== null) {
                //                this._fcmService.saveFCMTokenOnServer();
            }
        });

    }
    /**
*addConnectivityListeners
* moniter network connection 
**/
    addConnectivityListeners() {
        this.network.onDisconnect().subscribe(() => {
            this.nav.push(OfflinePage);
        });
        this.network.onConnect().subscribe(() => {
            this.nav.pop();
        });

    }
    /**
*fcm
* use for handle NotificationOpen
**/
    fcm() {
        this.firebase.grantPermission();
        this.firebase.hasPermission().then((data) => {
        })
        this.firebase.onNotificationOpen().subscribe(res => {
            if (res.tap) {
                setTimeout(() => {
                    this.nav.push(OrderModalPage, {order_id: res.increment_id});
                }, 100)
                // background mode

            } else if (!res.tap) {
                this.localNotifications.schedule({
                    title: res.title,
                    text: res.body,
                    icon: 'file:///android_asset/www/assets/image/etech.jpg',
                    data: res.increment_id
                });
            }
            this.events.publish('user:fcm', res['increment_id']);
        });
    }

}