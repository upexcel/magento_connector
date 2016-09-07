import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import {FORM_DIRECTIVES} from '@angular/common';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {RegisterPage} from '../register/register'
import {FormService } from './../../providers/form-service/form-service';
import {HomePage} from './../home/home';
@Component({
    templateUrl: 'build/pages/login/login.html',
    directives: [FORM_DIRECTIVES],
    providers: [FormService]
})
export class LoginPage {
    logform: FormGroup;
    spin: boolean;
    response: string;
    constructor(private navCtrl: NavController, private fb: FormBuilder, private _formService: FormService, public toastCtrl: ToastController) {
        this.logform = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        });
    }
    gotoreg() {
        this.navCtrl.push(RegisterPage);
    }
    signin(logvalue: any) {
        this.spin = true;
        this._formService.api('customer/login/', logvalue).subscribe((res) => {
            if (res) {
                console.log(res);
                this.spin = false;
                this.navCtrl.push(HomePage);
            }
        },
            (err) => {
                if (err.status == 500) {
                    this.spin = false;
                    this.response=JSON.parse(err._body).message;
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
}
