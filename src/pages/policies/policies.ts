import {Component} from '@angular/core';
import {CMS} from './../../model/cms/cms';
import {Storage} from '@ionic/storage';
@Component({
    selector: 'policy',
    templateUrl: 'policy.html'
})
export class Policy {
    theHtmlString: string;
    spinner: boolean = true;
    constructor(private _local: Storage, public _cms: CMS) {
        this._local.get('store_id').then((store_id: any) => {
            this._cms.getPrivacyInfo({"store_id": store_id, "page_code": "privacy-policy-cookie-restriction-mode"}).then((res) => {
                this.theHtmlString = res.body;
                this.spinner = false;
            })
        })
    }
}
