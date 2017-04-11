import { Component } from '@angular/core';
import { MyReviewData } from './../../model/myaccount/myReviews';
import { Storage } from '@ionic/storage';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';
import { ReviewDetails } from './reviewDetails';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'my-reviews',
    templateUrl: 'myReviews.html'
})
export class MyReviews {
    myReviewRes: any;
    spin: boolean = true;
    constructor(public _nav: NavController, private _appConfigService: AppDataConfigService, private _local: Storage, public _myReviewData: MyReviewData) { }
    ngOnInit() {
    }
    ionViewWillEnter() {
        this._appConfigService.getUserData().then((userData: any) => {
            this._local.get('store_id').then((store_id: any) => {
                if (userData.access_token != null) {
                    let data = { "secret": userData.secret, "store_id": store_id }
                    this._myReviewData.getMyDownlodeData(data).then((res: any) => {
                        this.spin = false;
                        this.myReviewRes = res['body'];
                        console.log("this.myReviewRes",this.myReviewRes)
                    }, (err) => { this.spin = false; })
                } else { }
            });
        });
    }
    viewDetails(data) {
        this._nav.push(ReviewDetails, { data: data });
    }
}