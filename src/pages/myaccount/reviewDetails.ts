import {Component, ViewChild} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {ProductReview} from '../../components/reviewProduct/ReviewProduct'

@Component({
    selector: 'review-details',
    templateUrl: 'reviewDetails.html'
})
export class ReviewDetails {
    @ViewChild(ProductReview) review: ProductReview;
    sku = "aws000c";
    data: any;

    constructor(private _navParam: NavParams) {
        this.data = this._navParam.get('data');
    }
    addReview() {
        
        this.review.addReview();
    }
}