import { Component, Input, OnInit } from '@angular/core';
import { ProductReviewDataType } from '../../model/product/productReviewDataType';
import { GetRating } from '../../model/product/getRatingDataType';
import { Product } from '../../model/product/getProduct';
import { ModalController} from 'ionic-angular';
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
    countPage: number = 1;
    reviewTitle: Array<any> = [];
    reviewKeys: Array<string> = [];
    graphRating = [];
    listLoad: boolean = false;
    addCommingReview:number=0;
    constructor(public _events: Events, private _modalCtrl: ModalController, private _getProduct: Product) {
        _events.subscribe('api:review', (review) => {
            this.fetchReview();
        });
    }
    ngOnInit() {
        let self = this;
        this._getProduct.getReview({}).then((getReview) => {
            this.getRating = getReview;
            forEach(this.getRating.body.attribute, function(title, titleKey) {
                self.reviewTitle.push(title);
                self.reviewKeys.push(titleKey);
            });
            this.fetchReview();
        }).catch((err) => { });
    }
    fetchReview() {
        let self = this;
        this.graphRating = [];
        this._getProduct.getProductReview({ "sku": this.skuData, "page": this.countPage }).then((review) => {
            this.productReview = review;
            this.listLoad = false;
            if (this.productReview.body.total_review != 0) {
                this.addCommingReview=this.addCommingReview+this.productReview.body.data.length;
                forEach(this.getRating.body.attribute, function(title, titleKey) {
                    forEach(self.productReview.body.total_attribute_rating, function(raw, key) {
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