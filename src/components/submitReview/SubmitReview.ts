import { Component, OnInit, Input } from '@angular/core';
import { NavParams } from 'ionic-angular';
import {ToastController} from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { SubmitReviewDataType } from '../../model/product/submitReview';
import { Product } from '../../model/product/getProduct';
import { Storage } from '@ionic/storage';
@Component({
    selector: 'submit-review',
    templateUrl: 'submitReview.html'
})
export class SubmitReview implements OnInit {
    skuValue: string;
    title: string;
    keys: string;
    spinReview: boolean = false;
    reviewDataDetails: string = "";
    reviewDataTitle: string = "";
    reviewDataNickname: string = "";
    reviewData: Array<string> = [];
    selectedRating: Array<string> = [];
    submitReviewData: SubmitReviewDataType;
    constructor(public _viewCtrl: ViewController, _params: NavParams, private _local: Storage, private _getProduct: Product, private _toastCtrl: ToastController) {
        this.skuValue = _params.get('sku');
        this.title = _params.get('title');
        this.keys = _params.get('keys');

    }
    ngOnInit() {
        this._local.get("access_token").then((access_token) => {
            if (access_token != null) {
                this._local.get('firstname').then((firstname) => {
                    this.reviewDataNickname = firstname;
                })
            } else {
            this.reviewDataNickname="";
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
                    this._viewCtrl.dismiss();
                    console.log(this.submitReviewData.data.review_status);
                    if (this.submitReviewData.data.review_status== "1"){
                   this.presentToast("Your Rating Is Approved");   
                    }
                    else{
                   this.presentToast("Your Rating Is Pendding");    
                    }
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