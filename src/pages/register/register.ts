import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './../../providers/api-service/api-service';
import { StartPage } from '../startpage/startpage';
import { ToastController } from 'ionic-angular';
import { HomePage } from './../home/home';
import { Storage } from '@ionic/storage';
import { RegisterConfig } from '../../providers/registerConfig/registerConfig';
import {LoginConfig} from '../../providers/loginConfig/loginConfig';
import { LoginConfigDataType } from '../login/loginConfigDataType';
@Component({
    templateUrl: 'register.html'
})
export class RegisterPage implements OnInit {
    regForm: FormGroup;
    spin: boolean;
    website_id: any;
    clear: boolean = false;
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
    constructor(private _loginConfig: LoginConfig,private _registerConfig:RegisterConfig ,private _local: Storage, private _navCtrl: NavController, private _fb: FormBuilder, private _apiService: ApiService, private _toastCtrl: ToastController) { }
    ngOnInit() {
        this._local.get('website_id').then((value: any) => {
            this.website_id = value;
            this.clear = true;
            this.fb_coll(value);
        });
    }
    fb_coll(value) {
        this.regForm = this._fb.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            website_id: [value]
        });
    }
    signup(regvalue: any) {
        this.spin = true;
        this._registerConfig.getregisterConfig(regvalue).then((res) => {
            this.spin = false;
            if (res.status == 1) {
                this.signin(regvalue);
            } else {
                this.presentToast(res.message);
            }
        }
        );
    }
    signin(logvalue: any) {
        this.spin = true;
        this._loginConfig.getLoginConfig(logvalue).then((res) => {
            this.spin = false;
            if (res.status === 1) {
                this.data = res;
                this._local.set('firstname', this.data.data.firstname);
                this._local.set('lastname', this.data.data.lastname);
                this._local.set('access_token', this.data.data.access_token);
                this._local.set('expiry', this.data.data.expiry);
                this._local.set('secret', this.data.data.secret);
                this._local.set('email', this.data.data.email);
                this._navCtrl.setRoot(HomePage);
            }                
        });
    }
    presentToast(message: string) {
        let toast = this._toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }
}
