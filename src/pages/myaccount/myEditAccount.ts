import {Component} from '@angular/core';
import {
    NavController,
    PopoverController,
} from 'ionic-angular';
import {FormBuilder, Validators} from '@angular/forms';
import {Storage} from '@ionic/storage';
import {MyAccount} from './../../model/myaccount/myaccount';
import {ToastService} from './../../providers/toast-service/toastService';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {EmailValidator} from '../../validation/emailValidate'
import {Edit} from './../../model/myaccount/editAccount';

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
    constructor(private _edit: Edit, private _appConfigService: AppDataConfigService, private _toast: ToastService, private _myaccount: MyAccount, private _local: Storage, private _navCtrl: NavController, private _popoverCtrl: PopoverController, private _fb: FormBuilder) {}
    ngOnInit() {
        this._appConfigService.getUserData().then((userData: any) => {
            this._local.get('website_id').then((website_id: any) => {
                if (userData.access_token != null) {
                    this.email = userData.email; //
                    this.getuser_details(website_id, userData.firstname, userData.lastname, userData.email);//call getuser_details with some optional parameter
                } else {}
            });
        });
    }

    getuser_details(websiteId, firstname?, lastname?, email?) {
        this.spin = true;
        this.spin = false;
        this.updateAccount = this._fb.group({    //set default value in form if exist
            firstname: [firstname, Validators.required],
            lastname: [lastname, Validators.required],
            email: [email, Validators.compose([Validators.maxLength(50),
            EmailValidator.isValidMailFormat, Validators.required])],
            websiteId: [websiteId],
            email_check: ['0']
        })
    }
    update(updateform) {
        this.editAccountspin = true;
        if (this.email != updateform.email) {  // check any change in email
            this.email = updateform.email;    //update email value
            updateform['email_check'] = 1;    // updateform['email_check'] =1 means changed  
        } else {
            updateform['email_check'] = '0';  //no change
        }
        this._edit.editAccount(updateform).then((updateAccount) => { // call api with sending 0 or 1 as change exist or not.
            this._toast.toast(updateAccount['body'], 3000);
            this.editAccountspin = false; //stop spin
            this._appConfigService.getUserData().then((userData: any) => {    //get user info from local storage
                userData.email = updateform.email;
                userData.firstname = updateform.firstname;
                userData.lastname = updateform.lastname;
                this._local.set('userData', userData); ///set updated user info local storage.
            })
        }, (err) => {
            this._toast.toast(JSON.parse(err._body).message, 3000);
            this.editAccountspin = false; // stop spinner when error exist
        })
    }
}