import { Component, OnInit, Input } from '@angular/core';
import { NavParams } from 'ionic-angular';
import {ToastController} from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { SubmitReviewDataType } from '../../model/product/submitReview';
import { Product } from '../../model/product/getProduct';
import { Storage } from '@ionic/storage';
import forEach from 'lodash/forEach';
import { Events } from 'ionic-angular';
@Component({
    selector: 'submit-review',
    templateUrl: 'submitReview.html'
})
export class SubmitReview implements OnInit {
    skuValue: string;
    title: string;
    keys: string;
    option: any;
    reviewDataDetails: string = "";
    reviewDataTitle: string = "";
    reviewDataNickname: string = "";
    reviewData: Array<string> = [];
    selectedRating: Array<string> = [];
    submitReviewData: SubmitReviewDataType;
    hideByLogin: boolean = true;
    submitSuccessful: boolean = false;
    constructor(public _events: Events, public _viewCtrl: ViewController, _params: NavParams, private _local: Storage, private _getProduct: Product, private _toastCtrl: ToastController) {
        this.skuValue = _params.get('sku');
        this.title = _params.get('title');
        this.keys = _params.get('keys');
        this.option = _params.get('option');
    }
    ngOnInit() {
        this._local.get("access_token").then((access_token) => {
            if (access_token != null) {
                this._local.get('firstname').then((firstname) => {
                    this.reviewDataNickname = firstname;
                    this.hideByLogin = false;
                })
            } else {
                this.reviewDataNickname = "";
            }
        })
    }
    close() {
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
        let ratingValueChangeAsApi = [];
        let finalSelectRating: Array<any> = [];
        for (let i = 0; i < this.keys.length; i++) {
            reviweDataJson[this.keys[i]] = this.selectedRating[i];
        };
        forEach(reviweDataJson, function(ratingValue, ratingKey) {
            ratingValue = ratingValue * 1;
            forEach(self.option, function(optionValue, optionKey) {
                if (ratingKey == optionKey) {
                    forEach(optionValue, function(Value, key) {
                        key = key* 1;
                        console.log(key);
                        console.log(ratingValue)
                        if( (key*1) == ( (ratingValue *1) - 1) ) {
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
                    if (this.submitReviewData.data.review_status == "1") {
                        this.presentToast("Your Rating Is Approved");
                    }
                    else {
                        this.presentToast("Your Rating Is Pendding");
                    }
                }
                this._events.publish('api:review', true);
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