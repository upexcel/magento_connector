import { Component } from '@angular/core';
import { NavController, ToastController, Storage, LocalStorage } from 'ionic-angular';
import {FORM_DIRECTIVES} from '@angular/common';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {RegisterPage} from '../register/register'
import {FormService } from './../../providers/form-service/form-service';
import {HomePage} from './../home/home';
import {ForgotPage} from './../forgot/forgot'
//import * as _ from 'lodash'
@Component({
    templateUrl: 'build/pages/login/login.html',
    directives: [FORM_DIRECTIVES],
    providers: [FormService]
})
export class LoginPage {
    logform: FormGroup;
    spin: boolean;
    response: string;
    local: any;
    website_id: any;
    constructor(private navCtrl: NavController, private fb: FormBuilder, private _formService: FormService, public toastCtrl: ToastController) {
        console.clear();
        this.local = new Storage(LocalStorage);
        this.website_id = localStorage.getItem('website_id');
        this.logform = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            website_id: [this.website_id]
        });

    }
    gotoreg() {
        this.navCtrl.push(RegisterPage);
    }
    signin(logvalue: any) {
        this.spin = true;
        this._formService.api('customer/login/', logvalue).subscribe((res) => {
            this.spin = false;
            if (res.status == 1) {
                this.local.set('firstname', JSON.parse(res.body).data.firstname);
                this.local.set('lastname', JSON.parse(res.body).data.lastname);
                this.local.set('access_token', JSON.parse(res.body).data.access_token);
                this.local.set('expiry', JSON.parse(res.body).data.expiry);
                this.local.set('email', JSON.parse(res.body).data.email);
                this.local.set('secret', JSON.parse(res.body).data.secret)
                //this.spin = false;
                this.navCtrl.setRoot(HomePage);
            } else {
                this.response = "Invalid email and password";
                this.showToast("top");
            }
        },
            (err) => {
                if (err.status == 0) {
                    console.log(err)
                    this.spin = false;
                    this.response = err.msg;
                    this.showToast("top");
                }

            }
        )
    }
    showToast(position: string) {
        let toast = this.toastCtrl.create({
            message: this.response,
            duration: 3000,
            position: position
        });

        toast.present(toast);
    }
    gotofor() {
        //forgot page
        this.navCtrl.push(ForgotPage);
    }
}
