import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, Events } from 'ionic-angular';
import { HomePage } from './../home/home'
import { Storage } from '@ionic/storage';
import { PopoverPage } from './../../components/popover/popover';
import { ChangePwd } from '../../model/changePassword/accountChangePwd';
import { ChangePwdDataType } from '../../model/changePassword/changePwdDataType';
import { ToastService } from './../../providers/toast-service/toastService';
import { User } from './userInterface';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';

@Component({
    selector: 'change-pass',
    templateUrl: 'changepassword.html'
})
export class ChangepasswordPage implements OnInit {
    response: ChangePwdDataType;
    access_token: string;
    spin: boolean = false;
    o_pass="password";
    n_pass="password";
    c_pass="password";
    public user: User;
    constructor(private _appConfigService: AppDataConfigService, private _toast: ToastService, private _events: Events, private _changePwd: ChangePwd, private _local: Storage, private _popoverCtrl: PopoverController, private _navCtrl: NavController) { }
    ngOnInit() {
        this.user = {
            password: '',
            newPassword: '',
            confirmPassword: ''
        }
        this._appConfigService.getUserData().then((userData: any) => {
            this.access_token = userData.access_token;
        });
    }
    change(pass){
        var ref="this."+pass;
        console.log("pass",pass)
        if(pass=="password"){
            ref="text";
        }else{
            ref="password";
        }        
    }
    changepassword(model: User, isValid: boolean) {
        this.spin = true;
        let data = { "password": model.password, "newPassword": model.newPassword, access_token: this.access_token }
        this._changePwd.getPwd(data).then((res: any) => {
            this.spin = false;
            this.response = res;
            this._toast.toast(res.body, 3000, "bottom");
            if (res.body !== 'Incorrect Old Password.') {
                this._navCtrl.setRoot(HomePage);
            }
        }).catch(err => {
            this.spin = false;
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
