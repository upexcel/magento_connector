import { Component, OnInit } from '@angular/core';
import { ToastController,Events } from 'ionic-angular';
import {FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Forgot } from '../../model/forgot/forgot';
@Component({
    templateUrl: 'forgot.html'
})
export class ForgotPage implements OnInit {
    forgotform: any;
    spin: boolean;
    response: any;
    show_form: boolean = false;

    constructor(private _events:Events,private _forgot: Forgot, private _local: Storage, private _fb: FormBuilder, private _toastCtrl: ToastController) { }
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
            this.presentToast(res.message);
        })
            .catch(err => {
                if (err.status === 500) {
                }
            });
    }
    presentToast(message: string) {
        let toast = this._toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        });
        toast.present();
    }
}
