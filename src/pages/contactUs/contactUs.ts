import { Component } from '@angular/core';
import { CMS } from './../../model/cms/cms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../validation/emailValidate'
import { ToastService } from './../../providers/toast-service/toastService';
import forEach from 'lodash/forEach';
@Component({
    selector: 'contact-us',
    templateUrl: 'contactUs.html'
})
export class ContactUs {
    spinner = false;
    contactData: FormGroup;

    constructor(private _toast: ToastService, public _cms: CMS, private _fb: FormBuilder) {
        this.validate();
    }
    validate() {
        this.contactData = this._fb.group({
            name: ['', Validators.required],
            email: ['', Validators.compose([Validators.maxLength(50),
            EmailValidator.isValidMailFormat, Validators.required])],
            telephone: ['', Validators.compose([Validators.minLength(10)])],
            comment: ['', Validators.required]
        });
    }
    signin(data) {
        this.spinner = true;
        this._cms.setContactUsInfo(data).then((res) => {
            this.spinner = false;
            this.validate();
            this._toast.toast("Your inquiry was submitted and will be responded to as soon as possible. Thank you for contacting us.", 3000, "top");
        }, (err) => {
            this.spinner = false;
        })
    }
}
