import { Component, OnInit } from '@angular/core';
import { NavController, ToastController} from 'ionic-angular';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {RegisterPage} from '../register/register';
import {ApiService } from './../../providers/api-service/api-service';
import {HomePage} from './../home/home';
import {ForgotPage} from './../forgot/forgot';
import { Storage } from '@ionic/storage';
@Component({
    templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
    logform: FormGroup;
    spin: boolean;
    response: string;
    website_id: any;
    show_form: boolean = false;
    constructor(private _local: Storage, private _navCtrl: NavController, private _fb: FormBuilder, private _apiService: ApiService, private _toastCtrl: ToastController) { }
    ngOnInit() {
        this._local.get('website_id').then((value: any) => {
            this.website_id = value;
            this.show_form = true;
            this.fb_coll(value);
        });
    }
    fb_coll(value) {
        this.logform = this._fb.group({
            email: ['', Validators.required],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            website_id: [value]
        });
    }
    gotoreg() {
        this._navCtrl.push(RegisterPage);
    }
    signin(logvalue: any) {
        this.spin = true;
        this._apiService.api('customer/login/', logvalue).subscribe((res) => {
            this.spin = false;
            if (res.status === 1) {
                let body = JSON.parse(res.body);
                let firstname = body.data.firstname;
                let lastname = body.data.lastname;
                let access_token = body.data.access_token;
                let expiry = body.data.expiry;
                let secret = body.data.secret;
                let email = body.data.email;
                this._local.set('firstname', firstname);
                this._local.set('lastname', lastname);
                this._local.set('access_token', access_token);
                this._local.set('expiry', expiry);
                this._local.set('secret', secret);
                this._local.set('email', email);
                this._navCtrl.setRoot(HomePage);
            }
            else {
                this.presentToast(JSON.parse(res.body).message);
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
        let toast = this._toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }
    gotoforgotPage() {
        this._navCtrl.push(ForgotPage);
    }
}
