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
import { Edit } from './../../model/myaccount/editAccount';

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
    email: any;
    constructor(private _edit: Edit, private _appConfigService: AppDataConfigService, private _logout: LogoutService, private _toast: ToastService, private _myaccount: MyAccount, private _local: Storage, private _navCtrl: NavController, private _popoverCtrl: PopoverController, private _fb: FormBuilder) { }
    ngOnInit() {
        this._appConfigService.getUserData().then((userData: any) => {
            this._local.get('website_id').then((website_id: any) => {
                if (userData.access_token != null) {
                    this.email = userData.email;
                    this.getuser_details(userData.secret, website_id, userData.firstname, userData.lastname, userData.email);
                } else { }
            });
        });
        this._local.get('store_id').then((store_id) => {

        });

    }

    getuser_details(secret, websiteId, firstname?, lastname?, email?) {
        this.spin = true;
        this.spin = false;
        this.updateAccount = this._fb.group({
            firstname: [firstname, Validators.required],
            lastname: [lastname, Validators.required],
            email: [email, Validators.compose([Validators.maxLength(50),
            EmailValidator.isValidMailFormat, Validators.required])],
            secret: [secret],
            websiteId: [websiteId],
            email_check: ['0']
        })
    }
    update(updateform) {
        this.editAccountspin = true;
        if (this.email != updateform.email) {
            this.email = updateform.email;
            updateform['email_check'] = 1;
        } else {
            updateform['email_check'] = '0';
        }
        this._edit.editAccount(updateform).then((updateAccount) => {
            this._toast.toast(updateAccount['body'], 3000);
            this.editAccountspin = false;
            this._appConfigService.getUserData().then((userData: any) => {
                userData.email=updateform.email;
                userData.firstname=updateform.firstname;
                userData.lastname=updateform.lastname;
            this._local.set('userData', userData);
            })
        }, (err) => {
            this.editAccountspin = false;
        })
    }
    logout() {
        this._logout.logout(this.message, this._navCtrl);
    }

}