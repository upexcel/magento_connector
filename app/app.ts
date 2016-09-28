import {Component} from '@angular/core';
import {Platform, ionicBootstrap, LocalStorage, Storage} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {StartPage} from './pages/startpage/startpage';
import {LoadingModal} from './components/loading-modal/loading-modal';
import {HomePage} from './pages/home/home';
import {OrderlistPage} from './pages/orderlist/orderlist';
@Component({
    template: `<ion-nav [root]="rootPage"></ion-nav>
    <loading-modal id="loading"></loading-modal>`,
    directives: [LoadingModal]
})
export class MyApp {
    local:any
    private rootPage: any;

    constructor(private platform: Platform) {
        this.local = new Storage(LocalStorage);
        this.checkCredentials();
        platform.ready().then(() => {
            StatusBar.styleDefault();
        });
    }
    checkCredentials() {
        let name = this.local.get('firstname');
        let access_token;
        this.local.get('access_token').then((res) => {
            access_token = res;
            if (access_token != null) {
                console.log("Homepage")
                this.rootPage = HomePage;
            } else {
               console.log("Startpage")
               this.rootPage = StartPage;
            }
        });

    }
}

ionicBootstrap(MyApp);
