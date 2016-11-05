import {Component, OnInit, Input} from '@angular/core';
import {ToastController} from 'ionic-angular';
import { SubmitReviewDataType } from '../../model/product/submitReview';
import { Product } from '../../model/product/getProduct';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import values from 'lodash/values';
@Component({
    selector: 'submit-review',
    templateUrl: 'submitReview.html'
})
export class SubmitReview implements OnInit {
    @Input() skuValue: string;
    @Input() title: string;
    @Input() keys: string;
    spinReview: boolean = false;
    reviewDataDetails: string = "";
    reviewDataTitle: string = "";
    reviewDataNickname: string = "";
    reviewData: Array<string> = [];
    selectedRating: Array<string> = [];
    submitReviewData: SubmitReviewDataType;
    writeReview: boolean = false;
    constructor(private _local: Storage, private _events: Events, private _getProduct: Product, private _toastCtrl: ToastController) {
        this._events.subscribe('user:submitReview', (writeReview) => {
            this.writeReview = writeReview;
        });
    }
    ngOnInit() {

    }
    onSelectRatting(rating, title) {
        this.selectedRating = rating;
    }
    submitReview() {
        let valueOFReview = [];
        let reviweDataJson = {};
        this.presentToast("processing");
        this.spinReview = true;
        for (let i = 0; i < this.keys.length; i++) {
            reviweDataJson[this.keys[i]] = this.selectedRating[i];
        };
        this._local.get('store_id').then((store_id) => {
            let data = {
                sku: this.skuValue,
                "store_id": store_id,
                "title": this.reviewDataTitle,
                "details": this.reviewDataDetails,
                "nickname": this.reviewDataNickname,
                "rating_options": reviweDataJson
            };
            this._getProduct.getSubmitReview(data).then((res) => {
                this.submitReviewData = res;
                if (this.submitReviewData) {
                    this.writeReview = false;
                    this.presentToast(this.submitReviewData.message);
                }
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