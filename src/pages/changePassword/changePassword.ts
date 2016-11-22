import { Component, OnInit} from '@angular/core';
import { NavController, PopoverController, Events } from 'ionic-angular';
import {HomePage} from './../home/home'
import { Storage } from '@ionic/storage';
import {PopoverPage} from './../../components/popover/popover';
import { ChangePwd } from '../../model/changePassword/accountChangePwd';
import { ChangePwdDataType } from './changePwdDataType';
import {ToastService} from './../../providers/toast-service/toastService';
import { User } from './userInterface';
@Component({
    templateUrl: 'changepassword.html'
})
export class ChangepasswordPage implements OnInit {
    changepassform: any;
    response: ChangePwdDataType;
    access_token: string;
    spin: boolean = false;
    secret: string;
    public user: User;
    constructor(private _toast: ToastService, private _events: Events, private _changePwd: ChangePwd, private _local: Storage, private _popoverCtrl: PopoverController, private _navCtrl: NavController) { }
    ngOnInit() {
        this.user = {
            password: '',
            newPassword: '',
            confirmPassword: ''
        }
         this._local.get('access_token').then((access_token: any) => {
         this.access_token=access_token;
        this._local.get('secret').then((secret: any) => {
            this.secret = secret;
        });
        });
    }
    ionViewDidEnter() {
        setTimeout(() => { this._events.publish("title", { title: "Change Password" }); }, 0)
    }
    changepassword(model: User, isValid: boolean) {
        this.spin = true;
        let data = { "password": model.password, "newPassword": model.newPassword, "secret": this.secret,access_token:this.access_token }
        this._changePwd.getPwd(data).then((res) => {
            this.spin = false;
            this.response = res;
            this._toast.toast(this.response.data, 3000, "top");
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
