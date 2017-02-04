import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { SubmitReviewDataType } from '../../model/product/submitReview';
import { Product } from '../../model/product/getProduct';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';
import { Storage } from '@ionic/storage';
import forEach from 'lodash/forEach';
import { Events } from 'ionic-angular';
import { ToastService } from './../../providers/toast-service/toastService';
import { GoogleAnalyticsEvents } from './../../googleAnalyst/googleAnalyst'
@Component({
    selector: 'submit-review',
    templateUrl: 'submitReview.html'
})
export class SubmitReview implements OnInit {
    skuValue: string;
    title: string;
    keys: any;
    option: any;
    max_review: number;
    reviewDataDetails: string = "";
    reviewDataTitle: string = "";
    reviewDataNickname: string = "";
    reviewData: Array<string> = [];
    selectedRating: Array<string> = [];
    submitReviewData: SubmitReviewDataType;
    hideByLogin: boolean = true;
    submitSuccessful: boolean = false;
    constructor(private _toast: ToastService, private _appConfigService: AppDataConfigService, public _events: Events, public _viewCtrl: ViewController, _params: NavParams, private _local: Storage, private _getProduct: Product, private _toastCtrl: ToastController) {
        this.skuValue = _params.get('sku');
        this.title = _params.get('title');
        this.keys = _params.get('keys');
        this.option = _params.get('option');
        this.max_review = _params.get('max_review');
    }
    ngOnInit() {
        this._appConfigService.getUserData().then((userData: any) => {
            if (userData != null) {
                this.reviewDataNickname = userData.firstname;
                this.hideByLogin = false;
            } else {
                this.reviewDataNickname = "";
            }
        });
    }
    openPage(a, b, c, d, e) {
        GoogleAnalyticsEvents.trackEvent(a, b, c, d, e);
    }
    close() {
        GoogleAnalyticsEvents.trackEvent("close","click","submit",0,false);
        this._viewCtrl.dismiss();
    }
    onSelectRatting(rating, title) {
        this.selectedRating = rating;
    }

    submitReview() {
        let reviweDataJson = {};
        let selectedRating = {};
        let self = this;
        this.submitSuccessful = true;
        let ratingValueChangeAsApi: any = [];
        let finalSelectRating: Array<any> = [];
        for (let i = 0; i < this.keys.length; i++) {
            reviweDataJson[this.keys[i]] = this.selectedRating[i];
        };
        forEach(reviweDataJson, function(ratingValue: number, ratingKey) {
            forEach(self.option, function(optionValue, optionKey) {
                if (ratingKey == optionKey) {
                    forEach(optionValue, (Value, key: number) => {
                        if (key == ratingValue - 1) {
                            finalSelectRating.push({
                                value: Value,
                                key: ratingKey
                            })
                        }
                    })
                }
            })
        })
        forEach(finalSelectRating, function(value, key) {
            ratingValueChangeAsApi.push(value.value);
        })
        for (let i = 0; i < this.keys.length; i++) {
            selectedRating[this.keys[i]] = ratingValueChangeAsApi[i];
        };
        this._local.get('store_id').then((store_id) => {
            let data = {
                sku: this.skuValue,
                "store_id": store_id,
                "title": this.reviewDataTitle,
                "details": this.reviewDataDetails,
                "nickname": this.reviewDataNickname,
                "rating_options": selectedRating
            };
            this._getProduct.getSubmitReview(data).then((res) => {
                this.submitSuccessful = false;
                this.submitReviewData = res;
                if (this.submitReviewData) {
                    this._viewCtrl.dismiss();
                    if (this.submitReviewData.body.review_status == "1") {
                        this._toast.toast("Thanks for your review!", 3000);
                    }
                    else {
                        this._toast.toast("Thanks for your review! Your Rating is Pending approval by admin.", 3000);
                    }
                }
                this._events.publish('api:review', true);
            }).catch((res) => {
                this.submitSuccessful = false;
            })
        })
    }


    presentToast(message: string) {
        let toast = this._toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }
}