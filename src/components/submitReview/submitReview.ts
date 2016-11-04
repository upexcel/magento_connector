import {Component, OnInit} from '@angular/core';
import {ToastController} from 'ionic-angular';
import { SubmitReviewDataType } from '../../model/product/submitReview';
import { Product } from '../../model/product/getProduct';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular'
import clone from 'lodash/clone';
import values from 'lodash/values';
@Component({
    selector: 'submitReview',
    templateUrl: 'submitReview.html'
})
export class SubmitReview implements OnInit {
    selectedRating: any = [];
    spinReview: boolean = false;
    reviewDataDetails: string = "";
    reviewDataTitle: string = "";
    reviewDataNickname: string = "";
    reviewData: any = [];
    submitReviewData: SubmitReviewDataType;
    reviewTitle: any = [];
    reviewKeys: any = [];
    sku: string;
    writeReview: boolean = false;
    constructor(private _event: Events, private _getProduct: Product, private _local: Storage, private _toastCtrl: ToastController) {
        this._event.subscribe('user:submitReview', (writeReview) => {
            this.writeReview = writeReview;
        });
    }
    ngOnInit() {
        this._local.get('sku').then((sku: any) => {
            this.sku = sku.sku;
            this._local.get('reviewTitle').then((reviewTitle: any) => {
                this.reviewTitle = reviewTitle;
                this._local.get('reviewKeys').then((reviewKeys: any) => {
                    this.reviewKeys = reviewKeys;
                    console.log(this.reviewKeys);
                    console.log(this.reviewTitle);
                });
            });
        })
    }
    onSelectRatting(rating, title) {
        this.selectedRating = clone(rating);
        if (this.reviewTitle.length != rating.length) {
            //button disabled
        }
    }
    submitReview() {
        let valueOFReview = [];
        let json = {};
        this.presentToast("processing");
        this.spinReview = true;
        valueOFReview = values(this.reviewData);
        for (let i = 0; i < this.reviewKeys.length; i++) {
            json[this.reviewKeys[i]] = valueOFReview[i];
        };
        let data = {
            sku: this.sku,
            "store_id": "1",
            "title": this.reviewDataTitle,
            "details": this.reviewDataDetails,
            "nickname": this.reviewDataNickname,
            "rating_options": json

        };
        this._getProduct.getSubmitReview(data).then((res) => {
            this.submitReviewData = res;
            if (this.submitReviewData) {
                this.writeReview = false;
                this.spinReview = false;
                this.presentToast(this.submitReviewData.message);
            }
        })
    }
    activeSubmit(event: any) {
        this.writeReview = event;
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