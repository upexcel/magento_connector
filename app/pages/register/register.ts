import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FORM_DIRECTIVES} from '@angular/common';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormService } from './../../providers/form-service/form-service';
import {StartPage} from '../startpage/startpage';
import { ToastController } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/register/register.html',
    directives: [FORM_DIRECTIVES],
    providers: [FormService]
})
export class RegisterPage {
    regForm: FormGroup;
    constructor(private navCtrl: NavController, private fb: FormBuilder, private _formService: FormService, public toastCtrl: ToastController) {
        this.regForm = this.fb.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        })
         console.clear();
    }
    signup(regvalue: any) {
        this._formService.api("customer/register/", regvalue).subscribe((res) => {
            if (res) {
                this.presentToast(res.message);
                this.navCtrl.setRoot(StartPage);
            }
        },
            (err) => {

                if (err.status == 500) {
                    this.presentToast(JSON.parse(err._body).message);
                }

            })
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
