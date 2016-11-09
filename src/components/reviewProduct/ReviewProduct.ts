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
    displayAvgRating:any;
    constructor(private _modalCtrl: ModalController, public _events: Events, private _getProduct: Product) { }
    ngOnInit() {
        let self = this;
        this._getProduct.getProductReview({ "sku": this.skuData, "pagesize": this.countReview, "pageno": "1" }).then((review) => {
            this.productReview = review;
            this._getProduct.getReview({ "sku": this.skuData }).then((getReview) => {
                this.getRating = getReview;
                this.noOfREView = this.productReview.data.data.length;
                if (this.productReview.data.total_review != 0) {
                    this.displayAvgRating= parseInt(this.productReview.data.rating,10).toFixed(2);
                    forEach(this.getRating.data.data, function(value, key) {
                        forEach(value, function(title, key1) {
                            self.reviewTitle.push(title);
                            self.reviewKeys.push(key1);
                            forEach(self.productReview.data.total_attribute_rating, function(raw, key) {
                                forEach(raw, function(rating, key) {
                                    if (key1 == key) {
                                        self.AvgRating.push({
                                            value: title,
                                            key: rating
                                        })
                                    }
                                });
                            });
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
            this.noOfREView = this.productReview.data.data.length;
            if (this.productReview.data.total_review != 0) {
                this.reviewShow = true;
            }
        });
    }
    addReview(){
        let profileModal = this._modalCtrl.create(SubmitReview, { sku: this.skuData,title:this.reviewTitle,keys:this.reviewKeys });
        profileModal.present();
        this._events.publish('user:submitReview', true);
    }

}