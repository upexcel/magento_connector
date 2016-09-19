import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import {HomePage} from './../home/home'
import {FormService} from './../../providers/form-service/form-service'
import {FORM_DIRECTIVES} from '@angular/common';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
    templateUrl: 'build/pages/changepassword/changepassword.html',
    directives: [FORM_DIRECTIVES],
    providers: [FormService]
})
export class ChangepasswordPage {
    changepassform: any
    response: any
    constructor(private navCtrl: NavController, private toastCtrl: ToastController, private fb: FormBuilder, private _formService: FormService) {
        let access_token: any = localStorage.getItem("access_token");
        this.changepassform = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            newPassword: ['', Validators.required],
            secret: ['eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcHAubWFnZW50by5leGNlbGxlbmNlIiwiYXVkIjoibW9iaWxlX2FwcCJ9.R4eQ8HCunGPktBEMAVpt6B5IDFGrvgTEuzCKnsykQEY'],
            access_token: [access_token]
            //            cnewpass: ['', Validators.required]
        });
    }
    //    gotohome() {
    //        this.navCtrl.setRoot(HomePage);
    //    }
    changepassword(value: any) {
        console.log(value)
        this._formService.api("account/changepassword/", value).subscribe((res) => {
            if (res.status == 0) {
                this.response = "Invalid email address";
            } else {
                console.log(res)
                this.response = JSON.parse(res.body).data
            }
            this.showToast("top")
        })
    }
    showToast(position: string) {
        let toast = this.toastCtrl.create({
            message: this.response,
            duration: 2000,
            position: position
        });

        toast.present(toast);
    }
    doRefresh(refresher) {
        console.log('Begin async operation', refresher);

        setTimeout(() => {
            console.log('Async operation has ended');
            refresher.complete();
        }, 2000);
    }
}
