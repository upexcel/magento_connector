import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FORM_DIRECTIVES} from '@angular/common';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormService } from './../../providers/form-service/form-service';
@Component({
    templateUrl: 'build/pages/register/register.html',
    directives: [FORM_DIRECTIVES],
    providers: [FormService]
})
export class RegisterPage {
    regForm: FormGroup;
    constructor(private navCtrl: NavController, private fb: FormBuilder,private _formService: FormService) {
        this.regForm = this.fb.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        })
    }
    signup(regvalue: any) {
        console.log(regvalue);
        this._formService.api("customer/register/", regvalue).subscribe((res) => {
            if (res) {
                console.log(res);
            }
        },
            (err) => {

                if (err.status == 500) {
                   console.log(err);
                }

            })
    }

}
