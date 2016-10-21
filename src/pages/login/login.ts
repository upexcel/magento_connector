import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController} from 'ionic-angular';
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
<<<<<<< HEAD
    data: LoginConfigDataType = {
        data: {
            firstname: "",
            lastname: "",
            access_token: "",
            expiry: "",
            secret: "",
            email: "",
            store_id: ""
        }
    };
    constructor(private _loginConfig: LoginConfig, private _local: Storage, private _navCtrl: NavController, private _fb: FormBuilder, private _apiService: ApiService, private _toastCtrl: ToastController,private _alertCtrl: AlertController) { }
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
        this._loginConfig.getLoginConfig(logvalue).then((res) => {
            this.spin = false;
            if (res.status === 1) {
                this.data = res;
                console.log(this.data.data.firstname); 
                this._local.set('firstname', this.data.data.firstname);
                this._local.set('lastname', this.data.data.lastname);
                this._local.set('access_token', this.data.data.access_token);
                this._local.set('expiry', this.data.data.expiry);
                this._local.set('secret', this.data.data.secret);
                this._local.set('email', this.data.data.email);
                this._navCtrl.setRoot(HomePage);
            }
            else {
                this.presentToast(res.message);
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
    showLoginError(error) {
        let alert = this._alertCtrl.create({
            title: 'Error',
            subTitle: error,
            buttons: ['OK']
        });
        alert.present();
    }
}

