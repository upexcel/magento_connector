import { Component, Input, OnInit } from '@angular/core';
import { ProductReviewDataType } from '../../model/product/productReviewDataType';
import { GetRating } from '../../model/product/getRatingDataType';
import { Product } from '../../model/product/getProduct';
import { ModalController } from 'ionic-angular';
import { SubmitReview } from '../submitReview/SubmitReview';
import forEach from 'lodash/forEach';
import { Events } from 'ionic-angular';
@Component({
    selector: 'product-review',
    templateUrl: 'reviewProduct.html'
})
export class ProductReview implements OnInit {
    @Input() skuData: string;
    @Input() additionalInformationData:Array<any>;
    productReview: ProductReviewDataType;
    productReviewSpin: boolean = true;
    getRating: GetRating;
    showReview: string;
    totalAttributeRatingKey: Array<any>;
    reviewShow: boolean = false;
    countPage: number = 1;
    reviewTitle: Array<any> = [];
    reviewKeys: Array<string> = [];
    graphRating = [];
    listLoad: boolean = false;
    addCommingReview: number = 0;
    constructor(public _events: Events, private _modalCtrl: ModalController, private _getProduct: Product) {
        _events.subscribe('api:review', (review) => {
            this.fetchReview();
        });
    }
    ngOnInit() {
        this._getProduct.getReview({}).then((getReview) => {
            this.getRating = getReview;
            forEach(this.getRating.body.attribute, (title, titleKey)=> {
                this.reviewTitle.push(title);
                this.reviewKeys.push(titleKey);
            });
            this.fetchReview();
        }).catch((err) => { });
    }
    fetchReview() {
        this.graphRating = [];
        this.productReviewSpin = true;
            this._getProduct.getProductReview({ "sku": this.skuData, "page": this.countPage }).then((review) => {
                this.productReview = review;
                this.listLoad = false;
                this.productReviewSpin = false;
                if (this.productReview.body.total_review != 0) {
                    this.addCommingReview = this.addCommingReview + this.productReview.body.data.length;
                    forEach(this.getRating.body.attribute, (title, titleKey)=> {
                        forEach(this.productReview.body.total_attribute_rating, (raw, key)=> {
                            forEach(raw, (rating, key)=> {
                                if (titleKey == key) {
                                    this.graphRating.push({
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
                this.productReviewSpin = false;
            });
    }
    moreReview() {
        if (this.listLoad != true) {
            this.countPage = this.countPage + 1;
            this.fetchReview();
        }
        this.listLoad = true;
    }
    addReview() {
        let profileModal = this._modalCtrl.create(SubmitReview, { sku: this.skuData, title: this.reviewTitle, keys: this.reviewKeys, option: this.getRating.body.options, max_review: this.getRating.body.max_review });
        profileModal.present();
    }
}