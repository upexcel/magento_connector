import { Component, Input, OnInit } from '@angular/core';
import { ProductReviewDataType } from '../../model/product/productReviewDataType';
import { GetRating } from '../../model/product/getRatingDataType';
import { Product } from '../../model/product/getProduct';
import { ModalController, NavParams} from 'ionic-angular';
import { SubmitReview } from '../submitReview/SubmitReview';
import forEach from 'lodash/forEach';
import { Events } from 'ionic-angular';
@Component({
    selector: 'product-review',
    templateUrl: 'reviewProduct.html'
})
export class ProductReview implements OnInit {
    @Input() skuData: string;
    productReview: ProductReviewDataType;
    getRating: GetRating;
    showReview: string;
    totalAttributeRatingKey: Array<any>;
    noOfREView: any;
    reviewShow: boolean = false;
    countReview: number = 5;
    reviewTitle: Array<any> = [];
    reviewKeys: Array<string> = [];
    AvgRating = [];
    displayAvgRating: any;
    listLoad: boolean = false;
    constructor(public _events: Events, private _modalCtrl: ModalController, private _getProduct: Product) {
        _events.subscribe('api:review', (review) => {
            this.review();
        });
    }
    ngOnInit() {
        let self = this;
        this._getProduct.getReview({ "sku": this.skuData }).then((getReview) => {
            this.getRating = getReview;
            forEach(this.getRating.data.attribute, function(title, titleKey) {
                self.reviewTitle.push(title);
                self.reviewKeys.push(titleKey);
            });
            this.review();
        }).catch((err) => { });

    }
    review() {
        let self = this;
        this.AvgRating = [];
        this._getProduct.getProductReview({ "sku": this.skuData, "pagesize": this.countReview, "pageno": "1" }).then((review) => {
            this.productReview = review;
            this.noOfREView = this.productReview.data.data.length;
            if (this.productReview.data.total_review != 0) {
                this.displayAvgRating = this.productReview.data.rating;
                forEach(this.getRating.data.attribute, function(title, titleKey) {
                    forEach(self.productReview.data.total_attribute_rating, function(raw, key) {
                        forEach(raw, function(rating, key) {
                            if (titleKey == key) {
                                self.AvgRating.push({
                                    value: title,
                                    key: rating
                                })
                            }
                        });
                    });
                });
                this.reviewShow = true;
            }
            else {

            }
        }).catch((err) => {
        });
    }
    moreReview() {
        this.listLoad = true;
        this.countReview = this.countReview + 5;
        this._getProduct.getProductReview({ "sku": this.skuData, "pagesize": this.countReview, "pageno": "1" }).then((review) => {
            this.productReview = review;
            this.listLoad = false;
            this.noOfREView = this.productReview.data.data.length;
            if (this.productReview.data.total_review != 0) {
                this.reviewShow = true;
            }
        });
    }
    addReview() {
        let profileModal = this._modalCtrl.create(SubmitReview, { sku: this.skuData, title: this.reviewTitle, keys: this.reviewKeys, option: this.getRating.data.options });
        profileModal.present();
    }

}