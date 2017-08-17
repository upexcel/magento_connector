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
import {CartFunction} from '../../model/cart/cartHandling';
import {CartService} from './../../providers/cart-service/cart-service';
import {CartPage} from '../cart/cart';
import {MyAccount} from './../../model/myaccount/myaccount';
import {HomeProducts} from '../../model/home/homeProducts';

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
    ProductLogin: boolean = false;
    productData: any;
    ProductName: string;
    constructor(private _homeProductsConfig: HomeProducts, private _myaccount: MyAccount, private _cartService: CartService, private _cartFunction: CartFunction, public _viewCtrl: ViewController, public _navParams: NavParams, private _socialAccount: SocialAccount, private _toast: ToastService, private _events: Events, private _login: Login, private _local: Storage, private _navCtrl: NavController, private _fb: FormBuilder, private _alertCtrl: AlertController, private _appConfigService: AppDataConfigService) {}
    ngOnInit() {
        this.ProductLogin = this._navParams.get('checkoutLogin');// give true if page is redirect from checkout page to login page
        this.productData = this._navParams.get('res');//hold cart data use when user is not login
        this.ProductName = this._navParams.get('ProductName');
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

    addToCart() {
        this._myaccount.getMyAccount({});
        this._cartService.addCart(this.productData.add_cart, this.productData.editCartData).then((response: any) => {//call service fire api for cart add
            if (response.body['success']) {
                this.login = false;
                this._cartFunction.setCart(response.body['success_data']);//set data
                this._toast.toast(this.ProductName + " added to your shopping cart", 3000, "top");
                this._navCtrl.push(CartPage).then(() => {    //move to CartPage
                    const index = this._viewCtrl.index;
                    this._navCtrl.remove(index); //remove login page
                });
            }
            else {
                this.login = false;
            }
        }, (err) => {
            this.login = false;
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
                setTimeout(() => {
                    this._homeProductsConfig.resetHomeProducts();
                    this._homeProductsConfig.getHomeProducts();
                },300)
                if (this.ProductLogin) {
                    this.login = true;
                    this._cartFunction.resetCart();
                    setTimeout(() => {
                        this.addToCart();//call cart service        
                    }, 300)
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
            if (this.ProductLogin) {
                setTimeout(() => {
                    this.addToCart();//call cart service        
                }, 300)
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
            if (this.ProductLogin) {
                setTimeout(() => {
                    this.addToCart();//call cart service        
                }, 300)
            } else {
                this._navCtrl.setRoot(HomePage, {"access_token": res.body.access_token});//move to home page
            }
        });
    }
    gotoforgotPage() {
        this._navCtrl.push(ForgotPage, {email: this.forgotPasswordEmail});//move to Forgot Page 
    }
}
