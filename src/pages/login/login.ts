import { Component, OnInit } from '@angular/core';
import { NavController, ToastController} from 'ionic-angular';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {RegisterPage} from '../register/register';
import {ApiService } from './../../providers/api-service/api-service';
import {HomePage} from './../home/home';
import {ForgotPage} from './../forgot/forgot';
import { LoginConfigDataType } from './loginConfigDataType';
import { Storage } from '@ionic/storage';
import {LoginConfig} from '../../providers/loginConfig/loginConfig';
@Component({
    templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
    logform: FormGroup;
    spin: boolean;
    response: string;
    website_id: any;
    show_form: boolean = false;
    data: LoginConfigDataType = {
        firstname: "",
        lastname: "",
        access_token: "",
        expiry: "",
        secret: "",
        email: "",
        store_id: ""
    };
    constructor(private _loginConfig:LoginConfig , private _local: Storage, private _navCtrl: NavController, private _fb: FormBuilder, private _apiService: ApiService, private _toastCtrl: ToastController) { }
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
        this._loginConfig.getLoginConfig(logvalue).this((res)=>{
                     this.spin = false;
            if (res.status === 1) {
                this.data=res;   
                this._local.set('firstname', this.data.firstname);
                this._local.set('lastname', this.data.lastname);
                this._local.set('access_token', this.data.access_token);
                this._local.set('expiry', this.data.expiry);
                this._local.set('secret', this.data.secret);
                this._local.set('email', this.data.email);
                this._navCtrl.setRoot(HomePage);
            }
            else {
                this.presentToast(res.body.message);
            }
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
    gotoforgotPage() {
        this._navCtrl.push(ForgotPage);
    }
}
