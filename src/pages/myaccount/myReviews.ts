import {Component} from '@angular/core';
import {MyReviewData} from './../../model/myaccount/myReviews';
import {ReviewDetails} from './reviewDetails';
import {NavController} from 'ionic-angular';

@Component({
    selector: 'my-reviews',
    templateUrl: 'myReviews.html'
})
export class MyReviews {
    myReviewRes: object;
    spin: boolean = true;
    constructor(public _nav: NavController, public _myReviewData: MyReviewData) {}
    ionViewWillEnter() {
            this._myReviewData.getMyDownlodeData().then((res: any) => {
                this.spin = false;
                this.myReviewRes = res['body'];
            }, (err) => {this.spin = false;})
    }
    viewDetails(data) {
        this._nav.push(ReviewDetails, {data: data});
    }
}