import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController,Events } from 'ionic-angular';
import {ToastService} from './../../providers/toast-service/toastService';
import {PopoverPage} from './../../components/popover/popover';
import {StartPage} from './../../pages/startpage/startpage';
import { Storage } from '@ionic/storage';
import {GooglePlus} from 'ionic-native';
import {MyEditAccountPage} from './myeditaccount';
import {MyAccount} from './../../model/myaccount/myaccount';
import {MyAccountAddressDataType} from './../../model/myaccount/myaccountData';
import {LoginPage} from './../../pages/login/login';
@Component({
    templateUrl: 'savedAddress.html'
})
export class MySavedAddressPage implements OnInit {
    myaccount: MyAccountAddressDataType;
    spin: boolean;
    showAddress:boolean;
    secret:string;
    constructor(private _toast:ToastService, private _events:Events,private _myaccount: MyAccount, private _local: Storage, private _navCtrl: NavController, private _popoverCtrl: PopoverController) {
      _events.subscribe('api:savedaddress', (savedaddress) => {
        this.getInitAdd();
        });
     }
    ngOnInit() {
      this.getInitAdd();
    }
    getInitAdd(){
        this._local.get('access_token').then((access_token: any) => {
                this._local.get('secret').then((secret: any) => {
                    if (access_token != null) {
                        this.getuser_details(secret);
                        this.secret=secret;
                    } else {
                      this._navCtrl.push(LoginPage);
                    }
            });
        })
        .catch((err)=>{
        })
    }
    ionViewDidEnter() {
       setTimeout( () => {  this._events.publish("title",{title:"My Address"}); } , 0)
      }
    getuser_details(secret) {
        this.spin = true;
        let body = { "secret": secret };
        this._myaccount.getMyAccount(body).then((res) => {
            this.spin = false;
            this.myaccount = res;
            if(this.myaccount.data.length!=0){
              this.showAddress=true;
            }else{
                this.showAddress=false;
            }
        })
            .catch(err => {
                this.logout();
            })
    }
    presentPopover(myEvent: any) {
        let popover = this._popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }
    addNewAddress() {
      let entity_id=null;
        this._navCtrl.push(MyEditAccountPage, {
            "title": "Add New Address","entity_id":entity_id
        })
    }
    editAccount(id,entity_id) {
        this._navCtrl.push(MyEditAccountPage, {
            "title": "Edit Address", "id": id ,"entity_id":entity_id
        })
    }
    deleteAccount(entity_id) {
      let self=this;
      let data={entity_id:entity_id,secret:this.secret};
      this._myaccount.deleteMyAddress(data).then((res)=>{
        this._toast.toast("Deleted",3000,"bottom");
        this.getInitAdd();
      })
      .catch((err)=>{
        console.log(err);
      })
    }
    logout() {
        this._local.remove('firstname');
        this._local.remove('lastname');
        this._local.remove('expiry');
        this._local.remove('access_token');
        this._local.remove('lists');
        this._local.remove('email');
        this._local.remove('secret');
        GooglePlus.logout();
        this._navCtrl.setRoot(StartPage, { "message": "Token expired" });
    }
}
