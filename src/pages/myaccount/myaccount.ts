import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, ToastController } from 'ionic-angular';
import {ApiService } from './../../providers/api-service/api-service';
import {PopoverPage} from './../../components/popover/popover';
import {FormBuilder } from '@angular/forms';
import {StartPage} from './../../pages/startpage/startpage';
import { Storage } from '@ionic/storage';
import {GooglePlus} from 'ionic-native';
import {MyAccount} from './../../modal/myaccount/myaccount';
import {EditAccount} from './../../modal/myaccount/editAccount';
@Component({
    templateUrl: 'myaccount.html'
})
export class MyAccountPage implements OnInit {
    spin: boolean;
    got: boolean = false;
    user_add: any;
    updateform: any;
    access_token: any;
    edit_res: any;
    upd_spin: boolean = false;
    firstname: any;
    lastname: any;
    msg: any;
    secret: any;
    constructor(private _myaccount: MyAccount, private _editaccount: EditAccount, private _local: Storage, private _toastCtrl: ToastController, private _navCtrl: NavController, private _popoverCtrl: PopoverController, private _fb: FormBuilder, private _apiService: ApiService) { }
    ngOnInit() {
        this._local.get('secret').then((value: any) => {
            this.secret = value;
            this._local.get('access_token').then((value: any) => {
                this.access_token = value;
                this._local.get('firstname').then((value: any) => {
                    this.firstname = value;
                    this._local.get('lastname').then((value: any) => {
                        this.lastname = value;
                        if (this.access_token != null) {
                            this.getuser_details();
                        } else {
                        }
                    });
                });
            });
        });
    }
    getuser_details() {
        this.spin = true;
        let body = { "secret": this.secret };
        this._myaccount.getMyAccount(body).then((res) => {
            if (res.statuscode == 500) {
                this.logout();
            } else {
                var condition = res.data;
                if (condition.length == 0) {
                    this.got = true
                    this.spin = false
                    this.user_add = res.data;
                    this.updateform = this._fb.group({
                        firstname: [this.firstname],
                        lastname: [this.lastname],
                        city: [' '],
                        company: [' '],
                        teliphone: [' '],
                        street: [' '],
                        zip: [' '],
                        countryid: [' '],
                        secret: [this.secret],
                        access_token: [this.access_token]
                    })
                } else {
                    this.spin = false;
                    this.user_add = res.data;
                    this.updateform = this._fb.group({
                        firstname: [this.user_add[0].firstname],
                        lastname: [this.user_add[0].lastname],
                        city: [this.user_add[0].city],
                        company: [this.user_add[0].company],
                        teliphone: [this.user_add[0].telephone],
                        street: [this.user_add[0].street],
                        zip: [this.user_add[0].postcode],
                        countryid: [this.user_add[0].country_id],
                        secret: [this.secret],
                        access_token: [this.access_token]
                    })
                }
            }
        })
            .catch(err => {
                console.log(err);
            })
    }
    update(value: any) {
        this.upd_spin = true;
        this._editaccount.updateAccount(value).then((res) => {
            this.upd_spin = false;
            if (res.status === 0) {
                this.msg = res.message;
            } else {
                this.msg = "Successfully updated";
            }
            this.presentToast(this.msg);
            console.log(this.presentToast(this.msg));
        })
            .catch(err => {
                console.log(err);
            })
    }
    presentToast(message: string) {
        let toast = this._toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top'
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