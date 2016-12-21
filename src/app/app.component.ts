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
import {CartPage} from '../pages/cart/cart';

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