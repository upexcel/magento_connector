import { Component } from '@angular/core';
import {
    NavController,
    PopoverController,
} from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { MyAccount } from './../../model/myaccount/myaccount';
import { LogoutService } from './../../providers/logout/logout-service';
import { ToastService } from './../../providers/toast-service/toastService';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';
import { EmailValidator } from '../../validation/emailValidate'
@Component({
    selector: 'edit-account',
    templateUrl: 'editAccount.html'
})
export class MyEditAccount {
    spin: boolean;
    myaccount;
    updateAccount: any;
    editAccountspin: boolean = false;
    message: string = "Token expired";
    constructor(private _appConfigService: AppDataConfigService, private _logout: LogoutService, private _toast: ToastService,  private _myaccount: MyAccount, private _local: Storage, private _navCtrl: NavController, private _popoverCtrl: PopoverController, private _fb: FormBuilder) { }
    ngOnInit() {
        this._appConfigService.getUserData().then((userData: any) => {
            if (userData.access_token != null) {
                this.getuser_details(userData.secret, userData.firstname, userData.lastname,userData.email);
            } else { }
        });
        this._local.get('store_id').then((store_id) => {

        });

    }

    getuser_details(secret, firstname?, lastname?,email?) {
        this.spin = true;
        let body = {
            "secret": secret
        };
            this.spin = false;
                this.updateAccount = this._fb.group({
                    firstname: [firstname, Validators.required],
                    lastname: [lastname, Validators.required],
                    email: [email, Validators.compose([Validators.maxLength(50),
                    EmailValidator.isValidMailFormat, Validators.required])],
                    secret: [secret]
                })
    }
    update(updateform) {
        this.editAccountspin=true;
console.log(updateform)
    }
    logout() {
        this._logout.logout(this.message, this._navCtrl);
    }

}