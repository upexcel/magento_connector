import { Component } from '@angular/core';
import { NavController, ToastController} from 'ionic-angular';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {RegisterPage} from '../register/register';
import {FormService } from './../../providers/form-service/form-service';
import {HomePage} from './../home/home';
import {ForgotPage} from './../forgot/forgot';
import { Storage } from '@ionic/storage';

//import * as _ from 'lodash'
@Component({
    templateUrl: 'login.html'
})
export class LoginPage {
    logform: FormGroup;
    spin: boolean;
    response: string;
    constructor(public local: Storage, public navCtrl: NavController, public fb: FormBuilder, public _formService: FormService, public toastCtrl: ToastController) {
        console.clear();
        this.logform = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            website_id: ['1']
        });
    }
    gotoreg() {
        this.navCtrl.push(RegisterPage);
    }
    signin(logvalue: any) {
        this.spin = true;
        this._formService.api('customer/login/', logvalue).subscribe((res) => {
            console.log(res);
            this.spin = false;
            if (res.status === 1) {
                var body = JSON.parse(res.body);
                var firstname = body.data.firstname;
                var lastname = body.data.lastname;
                var access_token = body.data.access_token;
                var expiry = body.data.expiry;
                var secret = body.data.secret;
                this.local.set('firstname', firstname);
                this.local.set('lastname', lastname);
                this.local.set('access_token', access_token);
                this.local.set('expiry', expiry);
                this.local.set('secret', secret);
                // this.spin = false;
                this.navCtrl.setRoot(HomePage);
            } else {
                this.response = res.msg;
                this.showToast('top');
            }
        },
            (err) => {
                if (err.status === 0) {
                    console.log(err)
                    this.spin = false;
                    this.response = err.msg;
                    this.showToast("top");
                }

            }
        )
    };
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
