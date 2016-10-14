import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, ToastController } from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import {PopoverPage} from './../../components/popover/popover';
import {HomePage} from './../home/home';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {StartPage} from './../../pages/startpage/startpage';
import { Storage } from '@ionic/storage';
import {GooglePlus} from 'ionic-native'
@Component({
    templateUrl: 'myaccount.html'
})
export class MyaccountPage {
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
    constructor(public local: Storage, public toastCtrl: ToastController, public navCtrl: NavController, public popoverCtrl: PopoverController, public fb: FormBuilder, public _formService: FormService) {
        this.local.get('secret').then((value: any) => {
            this.secret = value;
            this.local.get('access_token').then((value: any) => {
                this.access_token = value;
                this.local.get('firstname').then((value: any) => {
                    this.firstname = value;
                    this.local.get('lastname').then((value: any) => {
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
        this.spin = true; var body = { "access_token": this.access_token, "secret": this.secret }
        this._formService.api('account/address/', body).subscribe((res) => {
            if (res.error == 500) {
                this.logout();
            } else {
                var condition = JSON.parse(res.body).data;
                if (condition.length == 0) {
                    this.got = true
                    this.spin = false
                    this.user_add = JSON.parse(res.body).data;
                    this.updateform = this.fb.group({
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
                    this.user_add = JSON.parse(res.body).data;
                    this.updateform = this.fb.group({
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
    }
    update(value: any) {
        this.upd_spin = true;
        this._formService.api('address/edit', value).subscribe((res) => {
            this.upd_spin = false;
            if (res.status == 0) {
                this.msg = JSON.parse(res.body).message;
                this.showToast("bottom");
            } else {
                this.msg = "Successfully updated"
                this.showToast("bottom");
            }
        })
    }
    showToast(position: string) {
        console.log(this.msg)
        let toast = this.toastCtrl.create({
            message: this.msg,
            duration: 2000,
            position: position
        });
        toast.present(toast);
    }
    logoutToast(message: string) {
        let outtoast = this.toastCtrl.create({
            message: message,
            duration: 5000,
            position: 'top'
        });
        outtoast.present(outtoast);
    }
    presentPopover(myEvent: any) {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }
    logout() {
        this.local.remove('firstname');
        this.local.remove('lastname');
        this.local.remove('expiry');
        this.local.remove('access_token');
        this.local.remove('lists');
        this.local.remove('email');
        this.local.remove('secret');
         GooglePlus.logout();
        this.navCtrl.setRoot(StartPage, { "message": "your Session expired" });
    }
}