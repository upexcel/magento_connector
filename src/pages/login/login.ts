import { Component, OnInit } from '@angular/core';
import { NavController, AlertController,Events} from 'ionic-angular';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {RegisterPage} from '../register/register';
import {HomePage} from './../home/home';
import {ForgotPage} from './../forgot/forgot';
import { LoginDataType } from './loginDataType';
import { Storage } from '@ionic/storage';
import { Login } from '../../model/login/login';
import {ToastService} from './../../providers/toast-service/toastService';
@Component({
    templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
    logform: FormGroup;
    login: boolean=false;
    response: string;
    website_id: any;
    show_form: boolean = false;
    data: LoginDataType;
    constructor(private _toast:ToastService, private _events:Events,private _login: Login, private _local: Storage, private _navCtrl: NavController, private _fb: FormBuilder, private _alertCtrl: AlertController) { }
    ngOnInit() {
        this._local.get('website_id').then((website_id: any) => {
            this.show_form = true;
            this.logform = this._fb.group({
                email: ['', Validators.required],
                password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
                website_id: [website_id]
            });
        });
    }
    ionViewDidEnter() {
       setTimeout( () => {  this._events.publish("title",{title:"LOGIN"}); } , 0)
    }
    gotoreg() {
        this._navCtrl.push(RegisterPage);
    }
    signin(logvalue: any) {
        this.login = true;
        this._login.getLogin(logvalue).then((res) => {
            this.login = false;
            this.data=res;
            if (this.data.status === 1) {
                this.data = res;
                this._local.set('firstname', this.data.data.firstname);
                this._local.set('lastname', this.data.data.lastname);
                this._local.set('access_token', this.data.data.access_token);
                this._local.set('expiry', this.data.data.expiry);
                this._local.set('secret', this.data.data.secret);
                this._local.set('email', this.data.data.email);
                this._navCtrl.setRoot(HomePage,{"access_token":this.data.data.access_token});
            }
            else {
                this._toast.toast(res.message,3000,"top");
            }
        })
        .catch(err=>{
            this.showLoginError(err);
        })
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
