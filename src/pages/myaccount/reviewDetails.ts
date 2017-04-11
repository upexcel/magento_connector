import { Component } from '@angular/core';
import { NavParams} from 'ionic-angular';

@Component({
    selector:'review-details',
    templateUrl: 'reviewDetails.html'
})
export class ReviewDetails {
    sku="aws000c";
    data:any;
    constructor(private _navParam:NavParams) {
        this.data=this._navParam.get('data');
      }

}