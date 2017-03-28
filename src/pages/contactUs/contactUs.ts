import { Component } from '@angular/core';
import { CMS } from './../../model/cms/cms';

@Component({
    selector: 'contact-us',
    templateUrl: 'contactUs.html'
})
export class ContactUs {
    constructor(public _cms: CMS) {
        this._cms.getPrivacyInfo({}).then((res) => {

        })
    }
}
