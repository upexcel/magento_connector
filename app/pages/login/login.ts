import { Component } from '@angular/core';
import { NavController, ToastController, Storage, LocalStorage } from 'ionic-angular';
import {FORM_DIRECTIVES} from '@angular/common';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {RegisterPage} from '../register/register'
import {FormService } from './../../providers/form-service/form-service';
import {HomePage} from './../home/home';
import {ForgotPage} from './../forgot/forgot'
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
    constructor(private navCtrl: NavController, private fb: FormBuilder, private _formService: FormService, public toastCtrl: ToastController) {
        console.clear();
        this.logform = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        });
        this.local = new Storage(LocalStorage);
    }
    gotoreg() {
        this.navCtrl.push(RegisterPage);
    }
    signin(logvalue: any) {
        this.spin = true;
        this._formService.api('customer/login/', logvalue).subscribe((res) => {
            this.local.set('firstname', res.data.firstname);
            this.local.set('lastname', res.data.lastname);
            this.local.set('access_token', res.data.access_token);
            this.local.set('expiry', res.data.expiry);
            this.spin = false;
            this.navCtrl.setRoot(HomePage);

        },
            (err) => {
                if (err.status == 500) {
                    this.spin = false;
                    this.response = JSON.parse(err._body).message;
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
