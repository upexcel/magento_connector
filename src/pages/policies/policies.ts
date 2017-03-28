import { Component } from '@angular/core';
import { CMS } from './../../model/cms/cms';
@Component({
    selector: 'policy',
    templateUrl: 'policy.html'
})
export class Policy  {
    constructor(public _cms:CMS ) {
        this._cms.getPrivacyInfo({}).then((res)=>{
            
        })
         }


}
