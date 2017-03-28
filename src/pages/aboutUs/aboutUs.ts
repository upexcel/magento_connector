import { Component } from '@angular/core';
import { CMS } from './../../model/cms/cms';

@Component({
    selector: 'about-us',
    templateUrl: 'aboutUs.html'
})
export class AboutUs {
    constructor(public _cms: CMS) {
        this._cms.getPrivacyInfo({}).then((res) => {

        })
    }
}
