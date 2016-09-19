import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
@Component({
    templateUrl: 'build/pages/myaccount/myaccount.html',
    providers: [FormService]
})
export class MyaccountPage implements OnInit {
       spin:boolean;
       got:boolean=false;
       user_add:any;
       constructor(private navCtrl: NavController, private _formService: FormService) {

    }
    ngOnInit() {
        this.getuser_details();
    }

    getuser_details() {
        this.spin=true;
        var body = { "secret": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcHAubWFnZW50by5leGNlbGxlbmNlIiwiYXVkIjoibW9iaWxlX2FwcCJ9.R4eQ8HCunGPktBEMAVpt6B5IDFGrvgTEuzCKnsykQEY" }
        this._formService.api('account/address/', body).subscribe((res) => {
            this.got=true
            this.spin = false
            this.user_add = res.data;
            console.log(this.user_add)
        })
    }

}
