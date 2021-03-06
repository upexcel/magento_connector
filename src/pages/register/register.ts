import {Component, OnInit, NgZone} from '@angular/core';
import {NavController, Events} from 'ionic-angular';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {HomePage} from './../home/home';
import {Storage} from '@ionic/storage';
import {Register} from '../../model/register/register';
import {Login} from '../../model/login/login';
import {LoginDataType} from '../../model/login/loginDataType';
import {ToastService} from './../../providers/toast-service/toastService';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {EmailValidator} from '../../validation/emailValidate';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {CategoryProduct} from './../../model/categoryProduct/categoryProduct';
import {fcmService} from './../../providers/fcm-service/fcm-service';
import {CategoryList} from './../../model/home/categoryList';
@Component({
    selector: 'register',
    templateUrl: 'register.html'
})
export class RegisterPage implements OnInit {
    regForm: FormGroup;
    spin: boolean = false;
    clear: boolean = false;
    browser: any;
    data: LoginDataType;
    constructor(private _categoryList: CategoryList, private _fcmService: fcmService, private _category: CategoryProduct, private _ngZone: NgZone, private iab: InAppBrowser, private _appConfigService: AppDataConfigService, private _toast: ToastService, private _login: Login, private _register: Register, private _local: Storage, private _navCtrl: NavController, private _fb: FormBuilder, private _events: Events) {}
    ngOnInit() {
        this._local.get('website_id').then((website_id: any) => {
            this.clear = true;
            this.regForm = this._fb.group({//validate register form
                firstname: ['', Validators.required],
                lastname: ['', Validators.required],
                email: ['', Validators.compose([Validators.maxLength(50),
                EmailValidator.isValidMailFormat, Validators.required])],
                password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
                website_id: [website_id]
            });
        });
    }
    /*
     * function use for register
     */
    signup(regvalue: any) {
        this.spin = true;
        this._register.getRegister(regvalue).then((res) => { //call api

            if (res.status == 1) {
                this.signin(regvalue);
            } else {
                this.spin = false;
                this._toast.toast(res.message, 3000, "top");
            }
        }).catch(err => {
            this.spin = false;
            this._toast.toast(JSON.parse(err._body).message, 3000);
        })


    }

    commanApiCall() {
        setTimeout(() => {
            this._fcmService.saveFCMTokenOnServer();
            this._categoryList.getId().then((id) => {
                this._category.getCategoryProduct({"id": id, "page": 1, "limit": 2, "sort_by": "position", "sort_order": "asc", "filter": []});
            })
        }, 200)

    }

    /*
     * function use for login 
     */
    signin(logvalue: any) {
        this._login.getLogin(logvalue).then((res) => {//call api for login
            this.spin = false;
            this.data = res;
            if (this.data.status === 1) {
                this.data = res;
                res.body['login'] = "normal";
                this._appConfigService.setUserData(res.body);// set user data on local storage
                this._toast.toast("Welcome " + logvalue.firstname, 3000);
                this.commanApiCall();
                //set home page as a root page .
                this._navCtrl.setRoot(HomePage, {"access_token": this.data.body.access_token});
            }
            else {
                this._toast.toast(res.message, 3000);
            }
        })
            .catch(err => {
                this.spin = false;
                this._toast.toast(JSON.parse(err._body).message, 3000);
            });
    }
    /*
     * open link in inapp browser
     */
    privacyPolicy() {
        this._ngZone.run(() => {
            this.browser = this.iab.create('https://xmagestore.com/privacy_policy.html', '_blank', 'hardwareback=yes ,location=yes');
        });

        // this.browser.show();
    }
}
