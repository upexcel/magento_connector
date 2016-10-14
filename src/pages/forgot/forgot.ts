import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormService } from './../../providers/form-service/form-service';
@Component({
    templateUrl: 'forgot.html'
})
export class ForgotPage {
    forgotform: any;
    spin: boolean;
    response: any;
    constructor(private navCtrl: NavController, private fb: FormBuilder, private _formService: FormService, public toastCtrl: ToastController) {
        this.forgotform = this.fb.group({
            email: ['', Validators.required],
            website_id: ["1"]
        });
        console.clear();
    }
    forgot(value: any) {
        this.spin = true;
        this._formService.api('customer/forgot/', value).subscribe((res) => {
            this.spin = false;
            this.response = JSON.parse(res.body).message;
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
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }
}
