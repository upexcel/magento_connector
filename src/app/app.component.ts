import {Component,OnInit} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {StartPage} from '../pages/startpage/startpage';
import {HomePage} from '../pages/home/home';
import { Storage } from '@ionic/storage';
import {AppConfig} from '../model/appConfig/appConfig';
@Component({
    template: `<ion-nav [root]="_rootPage"></ion-nav>
    <loading-modal id="loading"></loading-modal>`
})
export class MyApp implements OnInit{
    private _rootPage: any;
    constructor(private _platform: Platform, private _local: Storage,private _appConfig:AppConfig) {
    }
    ngOnInit(){
        this.appCheckConfig();
        this._platform.ready().then(() => {
            StatusBar.styleDefault();
        });
    }
    appCheckConfig(){
      this._local.get("website_id").then((website_id)=>{
        this._local.get("store_id").then((store_id)=>{
          this._local.get("require_login").then((require_login)=>{
            if(website_id==null && store_id==null && require_login==null){
                      this._appConfig.getAppConfig().then((res) => {
                          this._rootPage =StartPage;
                        })
                          .catch((err) => {
                          });
            }
            else{
              this._rootPage =HomePage;
            }
          })
        })
      })
    }
}
