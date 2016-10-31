import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController,Events } from 'ionic-angular';
import {PopoverPage} from './../../components/popover/popover';
import {StartPage} from './../../pages/startpage/startpage';
import { Storage } from '@ionic/storage';
import {GooglePlus} from 'ionic-native';
import {MyEditAccountPage} from './myeditaccount';
import {MyAccount} from './../../model/myaccount/myaccount';
import {MyAccountAddressDataType} from './../../model/myaccount/myaccountData';
@Component({
    templateUrl: 'savedAddress.html'
})
export class MySavedAddressPage implements OnInit {
    myaccount: MyAccountAddressDataType;
    spin: boolean;
    showAddress:boolean;
    constructor(private _events:Events,private _myaccount: MyAccount, private _local: Storage, private _navCtrl: NavController, private _popoverCtrl: PopoverController) {
      _events.subscribe('reloadPage1', () => {
        this._navCtrl.pop();
        this._navCtrl.push(MySavedAddressPage);
            });
     }
    ngOnInit() {
        this._local.get('secret').then((secret: any) => {
            this._local.get('access_token').then((access_token: any) => {
                if (access_token != null) {
                    this.getuser_details(secret);
                } else {
                }
            });
        });

    }
    getuser_details(secret) {
        this.spin = true;
        let body = { "secret": secret };
        this._myaccount.getMyAccount(body).then((res) => {
            this.spin = false;
            this.myaccount = res;
            console.log(JSON.stringify(res));
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
    deleteAccount() {

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
