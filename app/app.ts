import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {StartPage} from './pages/startpage/startpage';
import {LoadingModal} from './components/loading-modal/loading-modal';
import {productpage} from './pages/product/product';
@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>
    <loading-modal id="loading"></loading-modal>`,
  directives:[LoadingModal]
})
export class MyApp {

  private rootPage: any;

  constructor(private platform: Platform) {
    this.rootPage = StartPage;
    platform.ready().then(() => {
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp);
