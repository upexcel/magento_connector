import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
//import {HomePage} from './../home/home'
import * as _ from 'lodash'
import {FORM_DIRECTIVES} from '@angular/common';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
    templateUrl: 'build/pages/myaccount/myaccount.html',
    directives: [FORM_DIRECTIVES],
    providers: [FormService]
})
export class MyaccountPage implements OnInit {
    spin: boolean;
    got: boolean = false;
    user_add: any;
    updateform: any
    access_token:any
    constructor(private navCtrl: NavController, public fb: FormBuilder, private _formService: FormService) {
        this.access_token=localStorage.getItem("access_token");  

    }
    ngOnInit() {
        this.getuser_details();
    }

    getuser_details() {
        this.spin = true;
        let secret = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcHAubWFnZW50by5leGNlbGxlbmNlIiwiYXVkIjoibW9iaWxlX2FwcCJ9.R4eQ8HCunGPktBEMAVpt6B5IDFGrvgTEuzCKnsykQEY"
        var body = { "access_token": this.access_token, "secret": secret }
        this._formService.api('account/address/', body).subscribe((res) => {
            //console.log(res)
            this.got = true
            this.spin = false
            this.user_add = JSON.parse(res.body).data;
            console.log(this.user_add[0]);
            this.updateform = this.fb.group({
                fullname: [this.user_add[0].customer_name],
                city: [this.user_add[0].city],
                company: [this.user_add[0].company],
                telephone: [this.user_add[0].telephone],
                region: [this.user_add[0].region],
                zip: [this.user_add[0].postcode],
                country: [this.user_add[0].country_id]
            })
        })
    }
    update(value: any) {
        console.log(value)
//        this.spin=true;
//        var body = { "secret": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcHAubWFnZW50by5leGNlbGxlbmNlIiwiYXVkIjoibW9iaWxlX2FwcCJ9.R4eQ8HCunGPktBEMAVpt6B5IDFGrvgTEuzCKnsykQEY" }
//        this._formService.api('account/address/', body).subscribe((res) => {
//            this.got=true
//            this.spin = false
//            this.user_add = res.data;
//            console.log(this.user_add)
//        })
    }
}
