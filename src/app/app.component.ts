import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {StartPage} from '../pages/startpage/startpage';
import {HomePage} from '../pages/home/home';
import { Storage } from '@ionic/storage';
@Component({
    template: `<ion-nav [root]="rootPage"></ion-nav>
    <loading-modal id="loading"></loading-modal>`
})
export class MyApp {
    private rootPage: any;
    constructor(private platform: Platform, public storage: Storage) {
        this.checkCredentials();
        platform.ready().then(() => {
            StatusBar.styleDefault();
        });
    }
    checkCredentials() {
        var name;
        this.storage.get('firstname').then((value: any) => {
             name = value;
        });
        let access_token;
        this.storage.get('access_token').then((res) => {
            access_token = res;
            if (access_token != null || name !=null) {
                this.rootPage = HomePage;
            } else {
                this.rootPage = StartPage;
            }
        });

    }
}
