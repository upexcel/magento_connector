import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, ToastController, NavParams,Events} from 'ionic-angular';
import {PopoverPage} from './../../components/popover/popover';
import {FormBuilder } from '@angular/forms';
import {StartPage} from './../../pages/startpage/startpage';
import { Storage } from '@ionic/storage';
import {GooglePlus} from 'ionic-native';
import {MyAccount} from './../../model/myaccount/myaccount';
import {EditAccount} from './../../model/myaccount/editAccount';
import {MyAccountAddressDataType} from './../../model/myaccount/myaccountData';
import {EditAccountDataType} from './../../model/myaccount/editAccountData';
import {MySavedAddressPage} from './savedAddress';
@Component({
    templateUrl: 'myeditaccount.html'
})
export class MyEditAccountPage implements OnInit {
    myaccount: MyAccountAddressDataType;
    editaccount: EditAccountDataType;
    spin: boolean;
    updateform: any;
    upd_spin: boolean = false
    title: string;
    id: any;
    entity_id:any;
    message:string;
    constructor(private _events:Events,private _myaccount: MyAccount, private _editaccount: EditAccount, private _navParams: NavParams, private _local: Storage, private _toastCtrl: ToastController, private _navCtrl: NavController, private _popoverCtrl: PopoverController, private _fb: FormBuilder) { }
    ngOnInit() {
        this.title = this._navParams.get("title");
        this.id = this._navParams.get("id");
        this.entity_id=this._navParams.get("entity_id");
        this._local.get('secret').then((secret: any) => {
            this._local.get('access_token').then((access_token: any) => {
                if (access_token != null) {
                    this.getuser_details(this.id, this.entity_id, secret);
                } else {
                }
            });
        });
    }
    ionViewDidEnter() {
       setTimeout( () => {  this._events.publish("title",{title:this.title}); } , 0)
      }
    getuser_details(id, entity_id,secret) {
        this.spin = true;
        let body = { "secret": secret };
        this._myaccount.getMyAccount(body).then((res) => {
            this.myaccount = res;
            this.spin = false;
            if(this.myaccount.data.length!=0 && entity_id!=null){
              this.updateform = this._fb.group({
                  firstname: [this.myaccount.data[id].firstname],
                  lastname: [this.myaccount.data[id].lastname],
                  city: [this.myaccount.data[id].city],
                  company: [this.myaccount.data[id].company],
                  telephone: [this.myaccount.data[id].telephone],
                  fax: [this.myaccount.data[id].fax],
                  street: [this.myaccount.data[id].street],
                  zip: [this.myaccount.data[id].postcode],
                  countryid: [this.myaccount.data[id].country_id],
                  entity_id:[entity_id],
                  secret: [secret]
              })
            }else{
              this.updateform = this._fb.group({
                         firstname: [''],
                         lastname: [''],
                         city: [''],
                         company: [''],
                         telephone: [''],
                         fax: [''],
                         street: [''],
                         zip: [''],
                         countryid: [''],
                         entity_id:[''],
                         secret: [secret]
                     })
            }
        })
            .catch(err => {
                this.logout();
            })
    }
    update(value: any) {
      let self=this;
        self.upd_spin = true;
        this._editaccount.updateAccount(value).then((res) => {
            self.upd_spin = false;
            self.editaccount = res;
            if (self.editaccount.status === 1) {
                  self._events.publish('api:savedaddress',true);
                  self._navCtrl.pop();
            } else {
            self.presentUpdateToast(JSON.parse(self.editaccount.message).error);
            }
        })
            .catch(err => {
            });
    }
    presentUpdateToast(message) {
      let self=this;
      let toast = self._toastCtrl.create({
              message: message,
              position:'top',
              duration: 3000
            });
            toast.present();
    }
    presentPopover(myEvent: any) {
        let popover = this._popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }
    logout() {
      this._local.clear().then(() => {
        this._navCtrl.setRoot(StartPage, { "message": "Token expired" });
      });
    }
}
