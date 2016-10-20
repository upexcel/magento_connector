import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ApiService } from './../../providers/api-service/api-service';
import { Storage } from '@ionic/storage';
@Component({
    templateUrl: 'forgot.html'
})
export class ForgotPage implements OnInit {
    forgotform: any;
    spin: boolean;
    response: any;
    show_form: boolean = false;
    constructor(private _local: Storage, private _navCtrl: NavController, private _fb: FormBuilder, private _apiService: ApiService, private _toastCtrl: ToastController) { }
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
        this._apiService.api('customer/forgot/', value).subscribe((res) => {
            this.spin = false;
            this.response = res.message;
            this.presentToast(this.response);
        },
            (err) => {
                if (err.status == 500) {
                    this.spin = false;
                    this.response = JSON.parse(err.body).message;
                    this.presentToast(this.response);
                }
            }
        )
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
