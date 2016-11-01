import { Component, OnInit } from '@angular/core';
import { NavController,ToastController,Events } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HomePage } from './../home/home';
import { Storage } from '@ionic/storage';
import { Register } from '../../model/register/register';
import {Login} from '../../model/login/login';
import { LoginDataType } from '../login/loginDataType';
@Component({
    templateUrl: 'register.html'
})
export class RegisterPage implements OnInit {
    regForm: FormGroup;
    spin: boolean;
    clear: boolean = false;
    data: LoginDataType;
    constructor(private _login: Login, private _register: Register, private _local: Storage, private _navCtrl: NavController, private _fb: FormBuilder, private _events: Events, private _toastCtrl: ToastController) { }
    ngOnInit() {
        this._local.get('website_id').then((website_id: any) => {
            this.clear = true;
            this.regForm = this._fb.group({
                firstname: ['', Validators.required],
                lastname: ['', Validators.required],
                email: ['', Validators.required],
                password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
                website_id: [website_id]
            });
        });
    }
    ionViewDidEnter() {
       setTimeout( () => {  this._events.publish("title",{title:"Signup"}); } , 0)
    }
    signup(regvalue: any) {
        this.spin = true;
        this._register.getRegister(regvalue).then((res) => {
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
        this._login.getLogin(logvalue).then((res) => {
            this.spin = false;
            this.data=res;
            if (this.data.status === 1) {
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
