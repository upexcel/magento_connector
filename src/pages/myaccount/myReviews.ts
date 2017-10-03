import {Component} from '@angular/core';
import {MyReviewData} from './../../model/myaccount/myReviews';
import {ReviewDetails} from './reviewDetails';
import {NavController} from 'ionic-angular';

@Component({
    selector: 'my-reviews',
    templateUrl: 'myReviews.html'
})
export class MyReviews {
    myReviewRes: object;// hold response
    spin: boolean = true; // handle spinner
    constructor(public _nav: NavController, public _myReviewData: MyReviewData) {}
    ionViewWillEnter() {
        this._myReviewData.getMyDownlodeData().then((res: any) => { //call account/getReviews api
            this.spin = false; //stop spinner
            this.myReviewRes = res['body']; //copy response to globle variable
        }, (err) => {this.spin = false;})
    }

    viewDetails(data) {
        this._nav.push(ReviewDetails, {data: data});    //move to ReviewDetails page with data
    }
    trackmyReviewResFn(index, data) {
        return index;
    }
}