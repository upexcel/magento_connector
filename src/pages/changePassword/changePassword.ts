import { Component, OnInit} from '@angular/core';
import { NavController, PopoverController,Events } from 'ionic-angular';
import {HomePage} from './../home/home'
import {ApiService} from './../../providers/api-service/api-service'
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import {PopoverPage} from './../../components/popover/popover';
import { ChangePwd } from '../../model/changePassword/accountChangePwd';
import { ChangePwdDataType } from './changePwdDataType';
import {ToastService} from './../../providers/toast-service/toastService';

@Component({
    templateUrl: 'changepassword.html'
})
export class ChangepasswordPage implements OnInit {
    changepassform: any;
    response: ChangePwdDataType;
    email: string;
    access_token: string;
    spin: boolean = false;
    secret: string;
    changeActive: boolean = false;
    constructor(private _toast: ToastService,private _events:Events,private _changePwd: ChangePwd, private _local: Storage, private _popoverCtrl: PopoverController, private _navCtrl: NavController, private _fb: FormBuilder, private _apiService: ApiService) { }
    ngOnInit() {
        this._local.get('userData').then((userData: any) => {
            this.secret = userData.secret;
            this.access_token = userData.access_token;
            this.changepassform = this._fb.group({
                password: ['', Validators.required],
                newPassword: ['', Validators.required],
                secret: [this.secret],
                access_token: [this.access_token]
            });
            this.changeActive = true;
        });
    }
    ionViewDidEnter() {
       setTimeout( () => {  this._events.publish("title",{title:"Change Password"}); } , 0)
      }
    changepassword(value: any) {
        this.spin = true;
        this._changePwd.getPwd(value).then((res) => {
            this.spin = false;
            this.response = res;
            this._toast.toast(this.response.data,3000,"top");
            this._navCtrl.setRoot(HomePage);
        })
    }

    doRefresh(refresher) {
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
    presentPopover(myEvent: any) {
        let popover = this._popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }
}
