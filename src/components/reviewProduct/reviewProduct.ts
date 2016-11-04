import {Component, OnInit} from '@angular/core';
import { Events } from 'ionic-angular'
import {ToastController} from 'ionic-angular';
import { ProductReviewDataType } from '../../model/product/productReviewDataType';
import { SubmitReviewDataType } from '../../model/product/submitReview';
import { GetRating } from '../../model/product/getRatingDataType';
import { Product } from '../../model/product/getProduct';
import { Storage } from '@ionic/storage';
import forEach from 'lodash/forEach';
import clone from 'lodash/clone';

@Component({
    selector: 'productReview',
    templateUrl: 'reviewProduct.html'
})
export class ProductReview implements OnInit {
    productReview: ProductReviewDataType;
    getRating: GetRating;
    showReview: string;
    keys: any = [];
    search: any = [];
    moreReviewShow: boolean = false;
    res: {} = {};
    TotalReview: any;
    totalAttributeRatingKey: any = [];
    review: any = [5, 4, 3, 2, 1];
    noOfREView: any;
    reviewShow: boolean = false;
    price: number;
    data: string;
    sku: string;
    countReview: number = 5;
    constructor(private _event:Events,private _getProduct: Product, private _local: Storage, private _toastCtrl: ToastController) { }
    ngOnInit() {
        let reviewTitle = [];
        let reviewKeys = [];
        let TotalReview = [];
        this._local.get('sku').then((sku: any) => {
            this.sku = sku.sku;
            this._getProduct.getProductReview({ "sku": sku.sku, "pagesize": this.countReview, "pageno": "1" }).then((review) => {
                this.productReview = review;
                this._getProduct.getReview(this.data).then((getReview) => {
                    this.getRating = getReview;
                    if (this.noOfREView != 0) {
                        forEach(this.getRating.data, function(value, key) {
                            forEach(value, function(title, key1) {
                                reviewTitle.push(title);
                                reviewKeys.push(key1);
                                forEach(review.data.total_attribute_rating, function(data, ratingkey) {
                                    forEach(data, function(reviewtitle, reviewkey1) {
                                        if (reviewkey1 == key1) {
                                            TotalReview.push({
                                                title: title,
                                                value: reviewtitle
                                            });
                                        }
                                    });
                                });
                            });
                        });
                        this.TotalReview = clone(TotalReview);
                        this._local.set('reviewTitle', reviewTitle);
                        this._local.set('reviewKeys', reviewKeys);
                        this.noOfREView = this.productReview.data.data.length;
                        this.reviewShow = true;
                    }
                }).catch((err) => { });
            }).catch((err) => { });
        })
    }
    moreReview() {
        this.countReview = this.countReview + 5;
        this._getProduct.getProductReview({ "sku": this.sku, "pagesize": this.countReview, "pageno": "1" }).then((review) => {
            this.productReview = review;
            this.moreReviewShow = true;
            this.noOfREView = this.productReview.data.data.length;
            if (this.noOfREView != 0) {
                this.reviewShow = true;
            }
        });
    }
    addReview() {
         this._event.publish('user:submitReview', true);

    }

}
