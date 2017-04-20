import {Component, OnInit, ViewChild} from '@angular/core';
import {Platform, NavController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {StartPage} from '../pages/startpage/startpage';
import {HomePage} from '../pages/home/home';
import {Storage} from '@ionic/storage';
import {AppDataConfigService} from '../providers/appdataconfig/appdataconfig';
import {Network} from 'ionic-native';
import {OfflinePage} from '../pages/offline/offline'
import {Splashscreen} from 'ionic-native';
import {Firebase} from '@ionic-native/firebase';
import {LocalNotifications} from '@ionic-native/local-notifications';
import {fcmService} from '../providers/fcm-service/fcm-service';
import {BackgroundMode} from '@ionic-native/background-mode';

@Component({
    template: `<ion-nav #myNav [root]="_rootPage"></ion-nav>
   `
})

export class MyApp implements OnInit {
    @ViewChild('myNav') nav: NavController
    public _rootPage: any;
    constructor(private backgroundMode: BackgroundMode, private _fcmService: fcmService, private localNotifications: LocalNotifications, private firebase: Firebase, private _platform: Platform, private _local: Storage, private _appConfigService: AppDataConfigService) {
        this._platform.ready().then(() => {
            this.hideSplashScreen();
            this._fcmService.initFCM();
            this.fcm();
            this.backgroundMode.enable();
        });
        this.addConnectivityListeners();
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
            }
            else {
                this._appConfigService.cleanUp();
                this._rootPage = HomePage;
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
        this.firebase.onNotificationOpen().subscribe(res => {
            console.log(res);
            if (res.tap) {
                // background mode

            } else if (!res.tap) {
                // foreground mode
                this.setLocalPush(res);
            }
        });
    }
    setLocalPush(res) {
        this.localNotifications.schedule({
            title: res.title,
            text: res.body
        });
    }
}