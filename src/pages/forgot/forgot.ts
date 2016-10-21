import { Component, OnInit } from '@angular/core';
import { ToastController } from 'ionic-angular';
import {FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ForgotConfig } from '../../providers/forgotConfig/forgotConfig';
@Component({
    templateUrl: 'forgot.html'
})
export class ForgotPage implements OnInit {
    forgotform: any;
    spin: boolean;
    response: any;
    show_form: boolean = false;
    constructor(private _forgotConfig: ForgotConfig, private _local: Storage, private _fb: FormBuilder, private _toastCtrl: ToastController) { }
    ngOnInit() {
        this._local.get('website_id').then((value: any) => {
            this.show_form = true;
            this.fb_coll(value);
        });
    }
    fb_coll(value) {
        this.forgotform = this._fb.group({
            email: ['', Validators.required],
            website_id: [value]
        });
    }
    forgot(value: any) {
        this.spin = true;
        let self = this;
        this._forgotConfig.getForgotConfig(value).then((res) => {
            self.spin = false;
            self.presentToast(res.message);
        })
            .catch(err => {
                if (err.status === 500) {
                    console.log(err);
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
