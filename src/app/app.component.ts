import {Component, OnInit} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {StartPage} from '../pages/startpage/startpage';
import {HomePage} from '../pages/home/home';
import { Storage } from '@ionic/storage';
import { AppDataConfigService } from '../providers/appdataconfig/appdataconfig';

@Component({
    template: `<ion-nav [root]="_rootPage"></ion-nav>
    <loading-modal id="loading"></loading-modal>`
})

export class MyApp implements OnInit {

    public _rootPage: any;
    constructor(private _platform: Platform, private _local: Storage, private _appConfigService: AppDataConfigService) {
        console.log(this._platform);

    }
    ngOnInit() {
        this._platform.ready().then(() => {
            if (this._platform.is('ios')) {
                StatusBar.hide();
            } else {
                StatusBar.styleDefault();
            }

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
                this._rootPage = StartPage;
            }
        })

    }
}
