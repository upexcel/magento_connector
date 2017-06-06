import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, NavController, Events, IonicApp, App } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { StartPage } from '../pages/startpage/startpage';
import { HomePage } from '../pages/home/home';
import { Storage } from '@ionic/storage';
import { AppDataConfigService } from '../providers/appdataconfig/appdataconfig';
import { Network } from 'ionic-native';
import { OfflinePage } from '../pages/offline/offline'
import { Splashscreen } from 'ionic-native';
import { Firebase } from '@ionic-native/firebase';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { fcmService } from '../providers/fcm-service/fcm-service';
import { OrderModalPage } from '../pages/orderid-detail/orderid-detail';
import { ToastService } from '../providers/toast-service/toastService';
import { Keyboard } from '@ionic-native/keyboard';

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
    constructor(public keyboard: Keyboard, private _toast: ToastService, private app: App, private ionicApp: IonicApp, public events: Events, private _fcmService: fcmService, private localNotifications: LocalNotifications, private firebase: Firebase, private _platform: Platform, private _local: Storage, private _appConfigService: AppDataConfigService) {
        this._platform.ready().then(() => {
            this.keyboard.hideKeyboardAccessoryBar(false);
            this.hideSplashScreen();
            this._fcmService.initFCM();
            this.fcm();
            this.checkBackButton();
            this.localNotifications.on("click", (data) => {
                setTimeout(() => {
                    this.nav.push(OrderModalPage, { order_id: data['data'] });
                }, 100)
            })
        });
        this.addConnectivityListeners();
        this.events.subscribe('goHome:home', ()=>{
            if(this.rootPageName == 'HomePage'){
                this.nav.setRoot(HomePage);
            } else{
                this._rootPage = HomePage;
                this.rootPageName = 'HomePage';    
            }            
        })
    }

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
                    activePortal.dismiss();
                    activePortal.onDidDismiss(() => { ready = true; });
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

    hideSplashScreen() {
        setTimeout(() => {
            Splashscreen.hide();
        }, 500);
    }
    ngOnInit() {
        this._platform.ready().then(() => {
            StatusBar.styleDefault();
            this.appCheckConfig();
        });
    }
    appCheckConfig() {
        this._local.get("web_config").then((web_config) => {
            if (web_config == null) {
                this._rootPage = StartPage;
                this.rootPageName = 'StartPage';
            }
            else {
                this._appConfigService.cleanUp();
                this._rootPage = HomePage;
                this.rootPageName = 'HomePage';
            }
        });
        this._appConfigService.getUserData().then((userData) => {
            if (userData !== null) {
                this._fcmService.saveFCMTokenOnServer();
            }
        });

    }
    addConnectivityListeners() {
        var isOnline = true;
        var onOnline = () => {
            Network.onConnect().subscribe(() => {
                if (isOnline) {
                    if (Network.type != "none") {
                        this.nav.pop();
                    }
                    isOnline = false;
                }
            });
        };
        var onOffline = () => {
            Network.onDisconnect().subscribe(() => {
                if (!isOnline) {
                    setTimeout(() => {
                        this.nav.push(OfflinePage);
                    }, 300);
                    isOnline = true;
                }
            });
        };

        window.addEventListener('online', onOnline, false);
        window.addEventListener('offline', onOffline, false);

    }
    fcm() {
        this.firebase.grantPermission();
        this.firebase.hasPermission().then((data)=>{
            console.log(data)
        })
        this.firebase.onNotificationOpen().subscribe(res => {
        console.log("resL:ocalNotify",res)
            if (res.tap) {
                setTimeout(() => {
                    this.nav.push(OrderModalPage, { order_id: res.increment_id });
                }, 100)
                // background mode

            } else if (!res.tap) {
                this.localNotifications.schedule({
                    title: res.title,
                    text: res.body,
                    data: res.increment_id
                });
            }
            this.events.publish('user:fcm', res['increment_id']);
        });
    }

}