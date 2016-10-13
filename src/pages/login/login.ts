import { Component } from '@angular/core';
import { NavController, ToastController} from 'ionic-angular';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {RegisterPage} from '../register/register';
import {FormService } from './../../providers/form-service/form-service';
import {HomePage} from './../home/home';
import {ForgotPage} from './../forgot/forgot';
import { Storage } from '@ionic/storage';
import _ from 'lodash';
@Component({
    templateUrl: 'login.html'
})
export class LoginPage {
    logform: FormGroup;
    spin: boolean;
    response: string;
    website_id: any;
    clear: boolean = false;
    constructor(public local: Storage, public navCtrl: NavController, public fb: FormBuilder, public _formService: FormService, public toastCtrl: ToastController) {
        console.clear();
        this.local.get('website_id').then((value: any) => {
            this.website_id = value;
            this.clear = true;
            this.fb_coll(value);
        });
        console.clear();
    }
    fb_coll(value) {
        this.logform = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            website_id: [value]
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
                var email = body.data.email;
                this.local.set('firstname', firstname);
                this.local.set('lastname', lastname);
                this.local.set('access_token', access_token);
                this.local.set('expiry', expiry);
                this.local.set('secret', secret);
                this.local.set('email', email);
                // this.spin = false;
                this.navCtrl.setRoot(HomePage);
            }
            else {
                this.presentToast(res.msg);
            }
        },
            (err) => {
                if (err.status === 0) {
                    console.log(err)
                    this.spin = false;
                    this.presentToast(err.msg);
                }

            }
        )
    }
    presentToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }
    gotofor() {
        //forgot page
        this.navCtrl.push(ForgotPage);
    }
}
