import {Component} from '@angular/core';
import {CMS} from './../../model/cms/cms';
import {Storage} from '@ionic/storage';
@Component({
    selector: 'about-us',
    templateUrl: 'aboutUs.html'
})
export class AboutUs {
    theHtmlString: string;
    spinner: boolean = true;
    constructor(private _local: Storage, public _cms: CMS) {
            this._cms.getAboutUsInfo({"page_code": "about-magento-demo-store"}).then((res) => {
                this.theHtmlString = res.body;
                this.spinner = false;
        })
    }
}
