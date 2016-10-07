import { Component } from '@angular/core';
import { NavController, Storage, LocalStorage  } from 'ionic-angular';
import {FORM_DIRECTIVES} from '@angular/common';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormService } from './../../providers/form-service/form-service';
import {StartPage} from '../startpage/startpage';
import { ToastController } from 'ionic-angular';
import {HomePage} from './../home/home';

@Component({
    templateUrl: 'build/pages/register/register.html',
    directives: [FORM_DIRECTIVES],
    providers: [FormService]
})
export class RegisterPage {
    regForm: FormGroup;
    spin: boolean;
    local: any;
    website_id:any;
    constructor(private navCtrl: NavController, private fb: FormBuilder, private _formService: FormService, public toastCtrl: ToastController) {
        this.local = new Storage(LocalStorage);
        this.website_id = localStorage.getItem('website_id');
        this.regForm = this.fb.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            website_id: [this.website_id]
        })
        //        console.clear();
    }
    signup(regvalue: any) {
        this.spin = true;
        this._formService.api("customer/register/", regvalue).subscribe((res) => {
            this.spin = false;
            if (res.status == 1) {
                //                this.presentToast(JSON.parse(res.body).message);
                this.signin(regvalue)
            } else {
                this.presentToast(JSON.parse(res.body).message);
            }
        }
        )
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
                this.navCtrl.setRoot(HomePage);
            }
        })
    }
    presentToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }
}
