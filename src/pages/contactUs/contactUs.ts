import {Component, OnInit} from '@angular/core';
import {CMS} from './../../model/cms/cms';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {EmailValidator} from '../../validation/emailValidate'
import {ToastService} from './../../providers/toast-service/toastService';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';

@Component({
    selector: 'contact-us',
    templateUrl: 'contactUs.html'
})
export class ContactUs implements OnInit {
    spinner = false;
    contactData: FormGroup;
    constructor(private _appDataConfigService: AppDataConfigService, private _toast: ToastService, public _cms: CMS, private _fb: FormBuilder) {
        this.validate();
    }
    ngOnInit() {
        this._appDataConfigService.getUserData().then((userData: any) => {
            this.contactData = this._fb.group({ //set default name and email 
                name: [(userData["firstname"]) ? userData["firstname"] : "", Validators.required],
                email: [(userData['email']) ? userData['email'] : "", Validators.compose([Validators.maxLength(50),
                EmailValidator.isValidMailFormat, Validators.required])],
                telephone: ['', Validators.compose([Validators.minLength(10)])],
                comment: ['', Validators.required]
            })
        })
    }
    validate() { // function use for validation
        this.contactData = this._fb.group({
            name: ['', Validators.required],
            email: ['', Validators.compose([Validators.maxLength(50),
            EmailValidator.isValidMailFormat, Validators.required])],
            telephone: ['', Validators.compose([Validators.minLength(10)])],
            comment: ['', Validators.required]
        })

    }
    signin(data) {
        this.spinner = true;
        this._cms.setContactUsInfo(data).then((res) => { //col api "web/contactus"
            this.spinner = false;
            this.validate();// col to blank form after submition 
            this._toast.toast("Your inquiry was submitted and will be responded to as soon as possible. Thank you for contacting us.", 3000, "top");
        }, (err) => {
            this.spinner = false;
        })
    }
}
