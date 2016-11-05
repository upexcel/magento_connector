import { Component, Input, OnInit } from '@angular/core';
import { ProductReviewDataType } from '../../model/product/productReviewDataType';
import { GetRating } from '../../model/product/getRatingDataType';
import { Product } from '../../model/product/getProduct';
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
    moreReviewShow: boolean = false;
    totalAttributeRatingKey: Array<any>;
    noOfREView: any;
    reviewShow: boolean = false;
    countReview: number = 5;
    reviewTitle: Array<any> = [];
    reviewKeys: Array<string> = [];
    constructor(public _events: Events, private _getProduct: Product) { }
    ngOnInit() {
        let self = this;
        this._getProduct.getProductReview({ "sku": this.skuData, "pagesize": this.countReview, "pageno": "1" }).then((review) => {
            this.productReview = review;
            this._getProduct.getReview({ "sku": this.skuData }).then((getReview) => {
                this.getRating = getReview;
                this.noOfREView = this.productReview.data.data.length;
                if (this.noOfREView != 0) {
                    forEach(this.getRating.data, function(value, key) {
                        forEach(value, function(title, key1) {
                            self.reviewTitle.push(title);
                            self.reviewKeys.push(key1);
                        });
                    });
                    this.reviewShow = true;
                }
            }).catch((err) => { });
        }).catch((err) => { });
    }
    moreReview() {
        this.countReview = this.countReview + 5;
        this._getProduct.getProductReview({ "sku": this.skuData, "pagesize": this.countReview, "pageno": "1" }).then((review) => {
            this.productReview = review;
            this.moreReviewShow = true;
            this.noOfREView = this.productReview.data.data.length;
            if (this.noOfREView != 0) {
                this.reviewShow = true;
            }
        });
    }
    addReview() {
        this._events.publish('user:submitReview', true);
    }

}