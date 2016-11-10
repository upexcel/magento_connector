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
    reviewShow: boolean = false;
    countReview: number;
    reviewTitle: Array<any> = [];
    reviewKeys: Array<string> = [];
    graphRating = [];
    listLoad: boolean = false;
    constructor(public _events: Events, private _modalCtrl: ModalController, private _getProduct: Product) {
        _events.subscribe('api:review', (review) => {
            this.fetchReview();
        });
    }
    ngOnInit() {
        let self = this;
        this._getProduct.getReview({}).then((getReview) => {
            this.getRating = getReview;
            this.countReview = this.getRating.data.max_review;
            forEach(this.getRating.data.attribute, function(title, titleKey) {
                self.reviewTitle.push(title);
                self.reviewKeys.push(titleKey);
            });
            this.fetchReview();
        }).catch((err) => { });
    }
    fetchReview() {
        let self = this;
        this.graphRating = [];
        this._getProduct.getProductReview({ "sku": this.skuData, "pagesize": this.countReview, "pageno": "1" }).then((review) => {
            this.productReview = review;
            if (this.productReview.data.total_review != 0) {
                forEach(this.getRating.data.attribute, function(title, titleKey) {
                    forEach(self.productReview.data.total_attribute_rating, function(raw, key) {
                        forEach(raw, function(rating, key) {
                            if (titleKey == key) {
                                self.graphRating.push({
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
        this.countReview = this.countReview + this.getRating.data.max_review;
        this.fetchReview();
    }
    addReview() {
        let profileModal = this._modalCtrl.create(SubmitReview, { sku: this.skuData, title: this.reviewTitle, keys: this.reviewKeys, option: this.getRating.data.options });
        profileModal.present();
    }
}