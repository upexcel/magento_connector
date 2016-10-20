import {Component,OnInit} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {StartPage} from '../pages/startpage/startpage';
import {HomePage} from '../pages/home/home';
import { Storage } from '@ionic/storage';
@Component({
    template: `<ion-nav [root]="_rootPage"></ion-nav>
    <loading-modal id="loading"></loading-modal>`
})
export class MyApp implements OnInit{
    private _rootPage: any;
    constructor(private _platform: Platform, private _local: Storage) {
    }
    ngOnInit(){
        this.checkCredentials();
        this._platform.ready().then(() => {
            StatusBar.styleDefault();
        });
    }
    checkCredentials() {
        let access_token;
        this._local.get('access_token').then((res) => {
            access_token = res;
            if (access_token != null) {
                this._rootPage = HomePage;
            } else {
                this._rootPage = StartPage;
            }
        });
    }
}
