import {Component} from '@angular/core';
import {CMS} from './../../model/cms/cms';
@Component({
    selector: 'policy',
    templateUrl: 'policy.html'
})
export class Policy {
    theHtmlString: string;
    spinner: boolean = true;
    constructor(public _cms: CMS) {
            this._cms.getPrivacyInfo({"page_code": "privacy-policy-cookie-restriction-mode"}).then((res) => {
                this.theHtmlString = res.body;
                this.spinner = false;
        })
    }
}
