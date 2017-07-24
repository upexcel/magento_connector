import {Component, OnInit} from '@angular/core';
import {NavController, AlertController, Events, NavParams, ViewController} from 'ionic-angular';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {RegisterPage} from '../register/register';
import {HomePage} from './../home/home';
import {ForgotPage} from './../forgot/forgot';
import {LoginDataType} from '../../model/login/loginDataType';
import {Storage} from '@ionic/storage';
import {Login} from '../../model/login/login';
import {ToastService} from './../../providers/toast-service/toastService';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {SocialAccount} from './../../model/startPage/socialAccount';
import {EmailValidator} from '../../validation/emailValidate';
import {Checkout} from './../checkOut/checkout';
import {CartFunction} from '../../model/cart/cartHandling';

@Component({
    selector: 'login',
    templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
    logform: FormGroup;
    login: boolean = false;
    response: string;
    show_form: boolean = false;
    data: LoginDataType;
    forgotPasswordEmail: object;
    title: string = 'LOGIN';
    checkoutLogin: boolean = false;
    cartData: Array<any>;
    constructor(private _cartFunction: CartFunction, public _viewCtrl: ViewController, public _navParams: NavParams, private _socialAccount: SocialAccount, private _toast: ToastService, private _events: Events, private _login: Login, private _local: Storage, private _navCtrl: NavController, private _fb: FormBuilder, private _alertCtrl: AlertController, private _appConfigService: AppDataConfigService) {}
    ngOnInit() {
        this.checkoutLogin = this._navParams.get('checkoutLogin');// give true if page is redirect from checkout page to login page
        //this.cartData = this._navParams.get('res');//hold cart data use when user is not login
        this._local.get('website_id').then((website_id: any) => { //get website_id
            this.show_form = true;
            //form validation
            this.logform = new FormGroup({
                password: new FormControl('', [
                    Validators.minLength(6),
                    Validators.required
                ]),
                email: new FormControl('', [
                    Validators.maxLength(50),
                    EmailValidator.isValidMailFormat,
                    Validators.required
                ]),
                website_id: new FormControl(website_id),
            });
        });
    }
    gotoreg() {
        this._navCtrl.push(RegisterPage);//move to RegisterPage
    }
    /*
     * function call when login click
     */
    signin(logvalue: any) { 
        this.login = true;
        this.forgotPasswordEmail = logvalue.email;
        this._login.getLogin(logvalue).then((res) => { //call login api
            this.login = false;
            this.data = res;
            if (this.data.status === 1) {
                this.data = res;
                this._appConfigService.setUserData(this.data.body); //set UserData into storage
                if (this.checkoutLogin) {
                    this._cartFunction.resetCart();
                    this._navCtrl.pop(Checkout);//move to Checkout
                } else {
                    this._navCtrl.setRoot(HomePage, {"access_token": this.data.body.access_token});//move to HomePage with access_token
                }
            }
            else {
                this._toast.toast(res.message, 3000, "top");
            }
        })
            .catch(err => {
                this.login = false;
                this._toast.toast(JSON.parse(err._body).message, 3000);
            })
    }
    /*
     * function use for facebook login
     */
    userFbLogin(body) {
        let data = body.data;
        this._socialAccount.getSocialAccount(data).then((res: any) => {
            this._appConfigService.setUserData(res.body);
            if (this.checkoutLogin) {
                this._navCtrl.pop(Checkout);//move to Checkout
            } else {
                this._navCtrl.setRoot(HomePage, {"access_token": res.body.access_token});//move to home page
            }
        });
    }
    /*
     * function use for google login
     */
    userGoogleLogin(body) { 
        this._socialAccount.getSocialAccount(body).then((res: any) => {
            this._appConfigService.setUserData(res.body);
            if (this.checkoutLogin) {
                this._navCtrl.pop(Checkout);//move to Checkout page
            } else {
                this._navCtrl.setRoot(HomePage, {"access_token": res.body.access_token});//move to home page
            }
        });
    }
    gotoforgotPage() {
        this._navCtrl.push(ForgotPage, {email: this.forgotPasswordEmail});//move to Forgot Page 
    }
}
