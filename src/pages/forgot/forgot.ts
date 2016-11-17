import { Component, OnInit } from '@angular/core';
import { Events } from 'ionic-angular';
import {FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Forgot } from '../../model/forgot/forgot';
import { ToastService } from './../../providers/toast-service/toastService';
import { LoginPage } from './../login/login';
import { NavController } from 'ionic-angular';
@Component({
    templateUrl: 'forgot.html'
})
export class ForgotPage implements OnInit {
    forgotform: any;
    spin: boolean=false;
    response: any;
    show_form: boolean = false;

    constructor( private _navCtrl: NavController, private _events:Events,private _forgot: Forgot, private _local: Storage, private _fb: FormBuilder, private _toast: ToastService) { }
    ngOnInit() {
        this._local.get('website_id').then((value: any) => {
            this.show_form = true;
            this.fb_coll(value);
        });
    }
    ionViewDidEnter() {
       setTimeout( () => {  this._events.publish("title",{title:"Forgot Password"}); } , 0)
    }
    fb_coll(value) {
        this.forgotform = this._fb.group({
            email: ['', Validators.required],
            website_id: [value]
        });
    }
    forgot(value: any) {
        this.spin = true;
        this._forgot.getForgot(value).then((res) => {
            this.spin = false;
            if(res.message=="success"){
            this._navCtrl.setRoot(LoginPage);
            }
            this._toast.toast(res.message,3000,"top");
        })
            .catch(err => {
                if (err.status === 500) {
                }
            });
    }
}

