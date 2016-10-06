import { Component } from '@angular/core';
import { NavController, ToastController, PopoverController } from 'ionic-angular';
import {HomePage} from './../home/home'
import {FormService} from './../../providers/form-service/form-service'
import {FORM_DIRECTIVES} from '@angular/common';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {PopoverPage} from './../../components/popover/popover';
@Component({
    templateUrl: 'build/pages/changepassword/changepassword.html',
    directives: [FORM_DIRECTIVES],
    providers: [FormService]
})
export class ChangepasswordPage {
    changepassform: any
    response: any
    email: any;
    access_token:any
    spin:boolean=false;
    secret:any;
    constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, private toastCtrl: ToastController, public fb: FormBuilder, private _formService: FormService) {
        this.access_token= localStorage.getItem("access_token");
        this.email = localStorage.getItem("email");
        this.secret = localStorage.getItem("secret");
        this.changepassform = this.fb.group({
            password: ['', Validators.required],
            newPassword: ['', Validators.required],
            secret: [this.secret],
            access_token: [this.access_token]
        });
    }
    changepassword(value: any) {
        console.log(value)
        this.spin=true;
        this._formService.api("account/changepassword/", value).subscribe((res) => {
            this.spin=false;
            if (res.status == 0) {
                this.response = "Invalid email address";
            }
            else {
                this.response = JSON.parse(res.body).data;
                this.navCtrl.setRoot(HomePage)
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
    presentPopover(myEvent: any) {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }
}
