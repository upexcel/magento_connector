import {Component,AfterContentInit} from '@angular/core';
import { PopoverController, MenuController, NavController, NavParams,Events} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {LoginPage} from '../../pages/login/login';
import {PopoverPage} from './../../components/popover/popover';
@Component({
  selector:'header',
  templateUrl:'headers.html'
})

export class Headers implements AfterContentInit{
  showPopOver:boolean=false;
  access_token:string;
  title:string;
  constructor(private _events:Events,private _navParams:NavParams,private _menuCtrl:MenuController,private _local:Storage,private _popoverCtrl: PopoverController,private _navCtrl:NavController){  }
  ngAfterContentInit(){
    let self=this;
    this._events.subscribe('title', (title) => {
      self.title=title[0];
    });
    this.access_token=this._navParams.get("access_token");
    this._local.get("access_token").then((access_token)=>{
        if(this.access_token!=null || access_token!=null){
          this.showPopOver=true;
        }else{
          this.showPopOver=false;
        }
    })
  }
  openMenu() {
      this._menuCtrl.open();
  }
  gotoLogin() {
      this._navCtrl.push(LoginPage);
  }
  presentPopover(myEvent) {
      let popover = this._popoverCtrl.create(PopoverPage);
      popover.present({
          ev: myEvent
      });
  }
}
