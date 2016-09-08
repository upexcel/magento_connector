import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {StartPage} from './pages/startpage/startpage';
import {LoadingModal} from './components/loading-modal/loading-modal';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>\n\
    <loading-modal id="loading"></loading-modal>',
  directives:[LoadingModal]
})
export class MyApp {

  private rootPage: any;

  constructor(private platform: Platform) {
    this.rootPage = StartPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp);
