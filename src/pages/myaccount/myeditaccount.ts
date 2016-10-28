import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, AlertController, NavParams} from 'ionic-angular';
import {PopoverPage} from './../../components/popover/popover';
import {FormBuilder } from '@angular/forms';
import {StartPage} from './../../pages/startpage/startpage';
import { Storage } from '@ionic/storage';
import {GooglePlus} from 'ionic-native';
import {MyAccount} from './../../model/myaccount/myaccount';
import {EditAccount} from './../../model/myaccount/editAccount';
import {MyAccountAddressDataType} from './../../model/myaccount/myaccountData';
import {EditAccountDataType} from './../../model/myaccount/editAccountData';
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
    constructor(private _myaccount: MyAccount, private _editaccount: EditAccount, private _navParams: NavParams, private _local: Storage, private _alertCtrl: AlertController, private _navCtrl: NavController, private _popoverCtrl: PopoverController, private _fb: FormBuilder) { }
    ngOnInit() {
        this.title = this._navParams.get("title");
        this.id = this._navParams.get("id");
        this._local.get('secret').then((secret: any) => {
            this._local.get('access_token').then((access_token: any) => {
                if (access_token != null) {
                    this.getuser_details(this.id, secret, access_token);
                } else {
                }
            });
        });
    }
    getuser_details(id, secret, access_token) {
        this.spin = true;
        let body = { "secret": secret };
        this._myaccount.getMyAccount(body).then((res) => {
            this.myaccount = res;
            this.spin = false;
            this.updateform = this._fb.group({
                firstname: [this.myaccount.data[id].firstname],
                lastname: [this.myaccount.data[id].lastname],
                city: [this.myaccount.data[id].city],
                company: [this.myaccount.data[id].company],
                teliphone: [this.myaccount.data[id].telephone],
                street: [this.myaccount.data[id].street],
                zip: [this.myaccount.data[id].postcode],
                countryid: [this.myaccount.data[id].country_id],
                secret: [secret]
            })
        })
            .catch(err => {
                this.logout();
            })
    }
    update(value: any) {
        this.upd_spin = true;
        this._editaccount.updateAccount(value).then((res) => {
            this.upd_spin = false;
            this.editaccount = res;
            if (this.editaccount.status === 0) {
                this.presentUpdateAlert(this.editaccount.message);
            } else {
                this.presentUpdateAlert("Successfully updated");
            }

        })
            .catch(err => {
                console.log(err);
            });
    }
    presentUpdateAlert(message) {
        let alert = this._alertCtrl.create({
            title: message,
            buttons: ['OK']
        });
        alert.present();
    }
    presentPopover(myEvent: any) {
        let popover = this._popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
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
