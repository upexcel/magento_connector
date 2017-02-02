import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, Nav, NavController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { StartPage } from '../pages/startpage/startpage';
import { HomePage } from '../pages/home/home';
import { Storage } from '@ionic/storage';
import { AppDataConfigService } from '../providers/appdataconfig/appdataconfig';
import { Network } from 'ionic-native';
import { OfflinePage } from '../pages/offline/offline'
import { Splashscreen } from 'ionic-native';
import { CartPage } from '../pages/cart/cart';
import { GoogleAnalytics } from 'ionic-native';
declare var window: any;
@Component({
    template: `<ion-nav #myNav [root]="_rootPage"></ion-nav>
   `
    //    <loading-modal id="loading"></loading-modal>
})

export class MyApp implements OnInit {
    @ViewChild('myNav') nav: NavController
    public _rootPage: any;
    constructor(private _platform: Platform, private _local: Storage, private _appConfigService: AppDataConfigService) {
        this._platform.ready().then(() => {
            this.hideSplashScreen();
            GoogleAnalytics.debugMode();
            console.log("typeof window.analytics", typeof GoogleAnalytics)
            //            GoogleAnalytics.startTrackerWithId('UA-91316126-1');
            GoogleAnalytics.startTrackerWithId('UA-91316126-1').then(
                res => console.log("res", res),
                error => console.log("error", error),
            );
            GoogleAnalytics.enableUncaughtExceptionReporting(true)
                .then((_success) => {
                    console.log("GoogleAnalytics")
                }).catch((_error) => {
                    console.log("erreee")
                });
        });
        this.addConnectivityListeners();
    }

    hideSplashScreen() {
        setTimeout(() => {
            Splashscreen.hide();
        }, 1000);
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
        })

    }
    addConnectivityListeners() {
        var isOnline = true;
        var onOnline = () => {
            Network.onConnect().subscribe(() => {

                if (isOnline) {
                    if (Network.connection) {
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
}