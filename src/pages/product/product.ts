import { Component, OnInit} from '@angular/core';
import { CartPage } from '../cart/cart';
import { NavController, NavParams,LoadingController,ToastController,Slides,Events} from 'ionic-angular';
import { ApiService } from './../../providers/api-service/api-service';
import { CartService } from './../../providers/cart-service/cart-service';
import { FormBuilder, Validators } from '@angular/forms';
import { Product } from '../../model/product/getProduct';
import { productDataType  } from './../product/productDataType';
import { Cart } from '../../model/product/cart';
import { ProductReviewDataType } from '../../model/product/productReviewDataType';
import {  cartDataType } from './../product/cartDataType';
import { SubmitReviewDataType } from '../../model/product/submitReview';
import { GetRating } from '../../model/product/getRatingDataType';
import { Storage } from '@ionic/storage';
import forEach from 'lodash/forEach';
import uniqWith from 'lodash/uniqWith';
import keys from 'lodash/keys';
import clone from 'lodash/clone';
import merge from 'lodash/merge';
import isEqual from 'lodash/isEqual';
import values from 'lodash/values';
import slice from 'lodash/slice';
@Component({
    templateUrl: 'product.html'
})
export class ProductPage implements OnInit {
    productData: productDataType;
    cartData: cartDataType;
    productReview: ProductReviewDataType;
    submitReviewData: SubmitReviewDataType;
    getRating: GetRating;
    quantity: number;
    sp_priceShow: boolean = false;
    selectshow: boolean = true;
    spin: boolean = true;
    itemSize: string;
    itemColor: string;
    selectSize: string;
    selectColor: string;
    selectedList: any = [];
    disable: boolean = true;
    product: string;
    images: string;
    final_price: number;
    showReview: string;
    spinReview: boolean = false;
    reviewTitle: any = [];
    reviewKeys: any = [];
    keys: any = [];
    search: any = [];
    res: {} = {};
    reviewData: any = [];
    TotalReview: any;
    totalAttributeRatingKey: any = [];
    data: any;
    review: any = [5, 4, 3, 2, 1];
//    reviewDisplay: boolean = false;
    noOfREView: any;
    reviewShow: boolean = false;
    reviewDataDetails: string = "";
    reviewDataTitle: string = "";
    reviewDataNickname: string = "";
    selectedRating: any = [];
    reviewTwo:any=[];
    otherreview:any=[];
    moreReviewShow:boolean=false;
    writeReview:boolean=false;
    price:number;
    constructor(private _events:Events,private _cart: Cart, private _getProduct: Product, private _local: Storage, private _cartService: CartService, private _toastCtrl: ToastController, private _loadingCtrl: LoadingController, private _navCtrl: NavController, private _navParams: NavParams, private _apiService: ApiService) {
        let id = _navParams.get('id');
        this.data = { sku: id };
    }
    ngOnInit() {
        this.product = "Product";
        let reviewTitle = [];
        let reviewKeys = [];
        let TotalReview = [];
        this.presentLoading();
        this._getProduct.getProduct(this.data).then((res) => {
            this.productData = res;
            if (res) {

                this._getProduct.getProductReview({ "sku": this.data.sku, "pagesize": "10", "pageno": "1" }).then((review) => {
                    this.productReview = review;
                    this._getProduct.getReview(this.data).then((getReview) => {
                        this.getRating = getReview;

                        if (this.noOfREView != 0) {
                            this.reviewTwo=slice(this.productReview.data.data, 0, 2);
                            this.otherreview = slice(this.productReview.data.data, 2, this.productReview.data.data.length );
                            console.log(this.reviewTwo);
                            console.log(this.otherreview );
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
                            this.reviewTitle = clone(reviewTitle);
                            this.reviewKeys = clone(reviewKeys);
                            this.noOfREView = this.productReview.data.data.length;
                            this.reviewShow = true;
                        }
                    }).catch((err) => { });
                }).catch((err) => { });
                                    this.spin = false;
                    this.images = this.productData.data.data.media_images[0];
                    this.price=this.productData.data.data.display_price;
                    this.final_price = this.productData.data.data.display_price;
                    if (this.productData.data.data.type != "configurable") {
                        this.disable = false;
                    }
                    if (this.productData.data.data.special_price > 0) {
                        this.sp_priceShow = true;
                        this.final_price = this.productData.data.data.special_price;
                    }
                    this.product = this.productData.data.data.name;
                    if (this.productData.data.associated_products) {
                        this.keys = keys(this.productData.data.associated_products.attributes);
                    }
            }
        }).catch((err) => {

        })
    }
    ionViewDidEnter() {
       setTimeout( () => { this._events.publish("title",{title:this.product,pagename:"product"}); } , 0)
    }
    onChange(res, key) {
        let count = 0;
        //take current selected item
        let res111 = res[key];
        //cloneing for use checked list in add cart function
        this.selectedList = clone(res);
        //        mapping between select list
        forEach(this.productData.data.associated_products.attributes, function(res1, key1) {
            if (key != key1) {
                forEach(res1.options, function(res2) {
                    res2.shown = false;
                    forEach(res111.products, function(res4) {
                        forEach(res2.products, function(res3) {
                            if (res4 == res3) {
                                res2.shown = true;
                            }
                        })
                    })
                })
            }
            else {
                forEach(res1.options, function(res2) {
                    res2.shown = true;
                });
            }
        })
        //change color of icon when its type is color
        this.selectshow = false;
        let myDiv = document.getElementById('color');
        myDiv.style.color = res[key].label;
        //disable button when select list is not checked
        if (typeof res != "undefined") {
            forEach(res, function(value) {
                count++;
            });

            if (this.keys.length == count) {
                this.disable = false;
            }
            else {
                this.disable = true;
            }
        }

    }
    moreReview(){
        this.moreReviewShow=true;
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
            sku: this.data.sku,
            "store_id": "1",
            "title": this.reviewDataTitle,
            "details": this.reviewDataDetails,
            "nickname": this.reviewDataNickname,
            "rating_options": json

        };
        this._getProduct.getSubmitReview(data).then((res) => {
            this.submitReviewData = res;
            if (this.submitReviewData) {
                this.writeReview=false;
                this.spinReview = false;
                this.presentToast(this.submitReviewData.message);
            }
        })
    }
    reviewChange(pageno: string) {
        this._getProduct.getProductReview({ "sku": this.data.sku, "pagesize": pageno, "pageno": "1" }).then((review) => {
            this.productReview = review
            this.noOfREView = this.productReview.data.data.length;
            if (this.noOfREView != 0) {
                this.reviewShow = true;
            }
        });
    }
    addReview(){
        this.writeReview=true;
    }
    presentLoading() {
        let loader = this._loadingCtrl.create({
            content: "Please wait...",
            duration: 2000
        });
        loader.present();
    }
    presentToast(message: string) {
        let toast = this._toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }
    slideClick(img: string) {
        this.images = img;
    }
    addCart(response) {
        let selectedItem: string;
        let array: any = {};
        let path: any;
        let data: any;
        //gather data for send in add cart servive
        let sku: string = response.data.sku;
        let img: string = response.data.media_images[0];
        let price: number = response.data.display_price;
        let name: string = response.data.name;
        let type: string = this.productData.data.data.type;
        let other;
        let productid: string = this.productData.data.data.entity_id;
        this._local.get('access_token').then((access_token: any) => {
            this._local.get('secret').then((secret) => {
                this._local.get('store_id').then((store_id: any) => {
                    data = { id: sku, img: img, name: name, price: price, type: type, quantity: 1 };
                    other = data;
                    //check type of data for send data in cart api
                    if (type == "configurable") {
                        forEach(this.selectedList, function(listdata, key) {
                            array[key] = listdata.id;
                        });
                        selectedItem = (array);
                        path = { "productid": productid, "options": selectedItem, "access_token": access_token, "secret": secret, "store_id": store_id };
                        other = merge(data, selectedItem);
                        let ser = this.productData.data.associated_products.attributes;
                        this._local.get('search').then((search: any) => {
                            if (search) {
                                this.search = search;
                                this.search.push(ser);
                                this._local.set('search', uniqWith(this.search, isEqual));
                            }
                            else {
                                this.search.push(ser);
                                this._local.set('search', uniqWith(this.search, isEqual));
                            }

                        });
                    }
                    else {
                        path = { "productid": productid, "access_token": access_token, "secret": secret, "store_id": store_id };
                    }

                    //cart api
                    this._cart.getCart(path).then((res) => {
                        if (res) {
                            //add to cart service
                            this._cartService.addCart(other, this.keys).then((response: any) => {
                                this.cartData = response;
                                if (this.cartData.data != "undefined") {
                                    this.presentToast("item inserted ");
                                    this._navCtrl.push(CartPage);
                                }
                                else {
                                }
                            });
                        }
                    }).catch((err) => {
                        this.presentToast(err);
                    })
                });
            });
        });
    }
}
