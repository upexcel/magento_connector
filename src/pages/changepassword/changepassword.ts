
import { Component, OnInit} from '@angular/core';
import { NavController, ToastController, PopoverController } from 'ionic-angular';
import {HomePage} from './../home/home'
import {FormService} from './../../providers/form-service/form-service'
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import {PopoverPage} from './../../components/popover/popover';
@Component({
    templateUrl: 'changepassword.html'
})
export class ChangepasswordPage implements OnInit {
    changepassform: any;
    response: any;
    email: string;
    access_token: string;
    spin: boolean = false;
    secret: string;
    changeActive: boolean = false;
    constructor(public local: Storage, public popoverCtrl: PopoverController, public navCtrl: NavController, private toastCtrl: ToastController, private fb: FormBuilder, private _formService: FormService) { }
    ngOnInit() {
        this.local.get('secret').then((value: any) => {
            this.secret = value;
            this.local.get('access_token').then((value: any) => {
                this.access_token = value;
                this.changepassform = this.fb.group({
                    password: ['', Validators.required],
                    newPassword: ['', Validators.required],
                    secret: [this.secret],
                    access_token: [this.access_token]
                });
                this.changeActive = true;
            });
        });
    }
    changepassword(value: any) {
        this.spin = true;
        this._formService.api("account/changepassword/", value).subscribe((res) => {
            this.spin = false;
            if (res.status == 0) {
                this.response = "Invalid email address";
                this.showToast(this.response)
            }
            else {
                this.response = JSON.parse(res.body).data;
                this.showToast(this.response);
                this.navCtrl.setRoot(HomePage);
            }
        })
    }
    showToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        });
        toast.present();
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
