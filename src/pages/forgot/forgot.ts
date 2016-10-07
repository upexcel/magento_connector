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
    response:any;
    constructor(private navCtrl: NavController, private fb: FormBuilder, private _formService: FormService, public toastCtrl: ToastController) {
        this.forgotform = this.fb.group({
            email: ['', Validators.required]
        });
        console.clear();
    }
    forgot(value: any) {
        this.spin = true;
        this._formService.api('customer/forgot/', value).subscribe((res) => {
            this.spin = false;
            this.response=JSON.parse(res.body).message;
             this.showToast("top");
        },
            (err) => {
                if (err.status == 500) {
                    this.spin = false;
                    this.response = JSON.parse(err.body).message;
                    this.showToast("top");
                }

            }
        )
    }
    showToast(position: string) {
        let toast = this.toastCtrl.create({
            message: this.response,
            duration: 2000,
            position: position
        });

        toast.present(toast);
    }
}
