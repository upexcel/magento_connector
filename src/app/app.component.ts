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
    public _rootPage: any;
    constructor(private _platform: Platform, private _local: Storage) {
    }
    ngOnInit(){
        this.appCheckConfig();
        this._platform.ready().then(() => {
            StatusBar.styleDefault();
        });
    }
    appCheckConfig(){
      this._local.get("web_config").then((web_config)=>{
            if(web_config==null){
                    this._rootPage =StartPage;
            }
            else{
              this._rootPage =HomePage;
            }
      })
    }
}
