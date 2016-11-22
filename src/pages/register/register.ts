import { Component, OnInit } from '@angular/core';
import { NavController,Events } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HomePage } from './../home/home';
import { Storage } from '@ionic/storage';
import { Register } from '../../model/register/register';
import {Login} from '../../model/login/login';
import { LoginDataType } from '../login/loginDataType';
import {ToastService} from './../../providers/toast-service/toastService';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';

@Component({
    templateUrl: 'register.html'
})
export class RegisterPage implements OnInit {
    regForm: FormGroup;
    spin: boolean=false;
    clear: boolean = false;
    data: LoginDataType;
    constructor( private _appConfigService: AppDataConfigService, private _toast:ToastService,private _login: Login, private _register: Register, private _local: Storage, private _navCtrl: NavController, private _fb: FormBuilder, private _events: Events) { }
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
       setTimeout( () => {  this._events.publish("title",{title:"SIGN UP"}); } , 0)
    }
    signup(regvalue: any) {
        this.spin = true;
        this._register.getRegister(regvalue).then((res) => {
            this.spin = false;
            if (res.status == 1) {
                this.signin(regvalue);
            } else {
                this._toast.toast(res.message,3000,"top");
            }
        }
        );
    }
    signin(logvalue: any) {
        this.spin = true;
        this._login.getLogin(logvalue).then((res) => {
            this.data=res;
            if (this.data.status === 1) {
                this.data = res;
                this._appConfigService.setUserData(res.data);
                this._navCtrl.setRoot(HomePage,{"access_token":this.data.data.access_token});
            }
            else {
                this._toast.toast(res.message,3000);
            }
        })
        .catch(err=>{
           
        });
    }
}
