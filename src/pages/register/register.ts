import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormService } from './../../providers/form-service/form-service';
import {StartPage} from '../startpage/startpage';
import { ToastController } from 'ionic-angular';
import {HomePage} from './../home/home';
import { Storage } from '@ionic/storage';
@Component({
    templateUrl: 'register.html'
})
export class RegisterPage {
    regForm: FormGroup;
    spin: boolean;
    website_id: any;
    clear:boolean=false;
    constructor(public local: Storage, public navCtrl: NavController, public fb: FormBuilder, public _formService: FormService, public toastCtrl: ToastController) {
        this.local.get('website_id').then((value: any) => {
            this.website_id = value;
            this.clear = true;
            this.fb_coll(value);
        });
        console.clear();
    }
        fb_coll(value){
        this.regForm = this.fb.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            website_id: [value]          
        });
    }
    signup(regvalue: any) {
        this.spin = true;
        this._formService.api("customer/register/", regvalue).subscribe((res) => {
            this.spin = false;
            if (res.status == 1) {
                //                this.presentToast(JSON.parse(res.body).message);
                this.signin(regvalue)
            } else {
                this.presentToast(JSON.parse(res.body).message);
            }
        }
        );
    }
    signin(logvalue: any) {
        this.spin = true;
        this._formService.api('customer/login/', logvalue).subscribe((res) => {
            this.spin = false;
            if (res.status == 1) {
                var body = JSON.parse(res.body);
                var firstname = body.data.firstname;
                var lastname = body.data.lastname;
                var access_token = body.data.access_token;
                var expiry = body.data.expiry;
                var secret = body.data.secret;
                var email = body.data.email;
                this.local.set('firstname', firstname);
                this.local.set('lastname', lastname);
                this.local.set('access_token', access_token);
                this.local.set('expiry', expiry);
                this.local.set('secret', secret);
                this.local.set('email', email);
                this.navCtrl.setRoot(HomePage);
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
