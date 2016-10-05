import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, ToastController } from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import {PopoverPage} from './../../components/popover/popover';
import {HomePage} from './../home/home'
import {FORM_DIRECTIVES} from '@angular/common';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {StartPage} from './../../pages/startpage/startpage'
@Component({
    templateUrl: 'build/pages/myaccount/myaccount.html',
    directives: [FORM_DIRECTIVES],
    providers: [FormService]
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
    msg:any;
    constructor(private toastCtrl: ToastController, private navCtrl: NavController, public popoverCtrl: PopoverController, public fb: FormBuilder, private _formService: FormService) {
        this.access_token = localStorage.getItem("access_token");
        this.firstname = localStorage.getItem("firstname");
        this.lastname = localStorage.getItem("lastname")
        if (this.access_token != null) {
            this.getuser_details();
        } else {
            console.log("your session expired")
        }
    }
    //    ngOnInit() {
    //        this.getuser_details();
    //    }

    getuser_details() {
        this.spin = true;
        let secret = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcHAubWFnZW50by5leGNlbGxlbmNlIiwiYXVkIjoibW9iaWxlX2FwcCJ9.R4eQ8HCunGPktBEMAVpt6B5IDFGrvgTEuzCKnsykQEY"
        var body = { "access_token": this.access_token, "secret": secret }
        this._formService.api('account/address/', body).subscribe((res) => {
            if (res.error == 500) {
                this.logout();
            } else {
                if (JSON.parse(res.body).data.length == 0) {
                    console.log(JSON.parse(res.body).data)
                    //                this.got = true
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
                        secret: [secret],
                        access_token: [this.access_token]
                    })
                } else {
                    //                this.got = true
                    this.spin = false
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
                        secret: [secret],
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
                this.msg=JSON.parse(res.body).message;
                this.showToast("top");
            } else {
                this.msg="Successfully updated"
                this.showToast("top");
            }
        })
    }
    showToast(position: string) {
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
        localStorage.removeItem('firstname');
        localStorage.removeItem('lastname');
        localStorage.removeItem('expiry');
        localStorage.removeItem('access_token');
        localStorage.removeItem('lists');
        localStorage.removeItem('email');
        this.navCtrl.setRoot(StartPage, { "message": "your Session expired" });
    }
}
