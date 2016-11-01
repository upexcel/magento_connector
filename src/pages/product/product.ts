import { Component, OnInit} from '@angular/core';
import { CartPage } from '../cart/cart';
import { NavController, NavParams } from 'ionic-angular';
import { ApiService } from './../../providers/api-service/api-service';
import { CartService } from './../../providers/cart-service/cart-service';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Product } from '../../model/product/getProduct';
import { productDataType  } from './../product/productDataType';
import { Cart } from '../../model/product/cart';
import { ProductReviewDataType } from '../../model/product/productReviewDataType';
import {  cartDataType } from './../product/cartDataType';
import { SubmitReviewDataType } from '../../model/product/submitReview';
import { Storage } from '@ionic/storage';
import forEach from 'lodash/forEach';
import uniqWith from 'lodash/uniqWith';
import keys from 'lodash/keys';
import clone from 'lodash/clone';
import merge from 'lodash/merge';
import isEqual from 'lodash/isEqual';
@Component({
    templateUrl: 'product.html'
})
export class ProductPage implements OnInit {
    productData: productDataType;
    cartData: cartDataType;
    productReview: ProductReviewDataType;
    submitReviewData: SubmitReviewDataType;
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
    keys: any = [];
    search: any = [];
    res: {} = {};
    data: any;
    review: any = [1, 2, 3, 4, 5];
    reviewDisplay: boolean = false;
    noOfREView: any;
    reviewShow: boolean = false;
    reviewDataPrice: string = "1";
    reviewDataValue: string = "1";
    reviewDataQualty: string = "1";
    reviewDataDetails: string = "";
    reviewDataTitle: string = "";
    reviewDataNickname: string = "";


    constructor(private _cart: Cart, private _getProduct: Product, private _local: Storage, private _cartService: CartService, private _toastCtrl: ToastController, private _loadingCtrl: LoadingController, private _navCtrl: NavController, private _navParams: NavParams, private _apiService: ApiService) {
        let id = _navParams.get('id');
        this.data = { sku: id };
    }
    ngOnInit() {
        this.product = "Product";
        this.presentLoading();
        this._getProduct.getProduct(this.data).then((res) => {
            if (res) {
                this._getProduct.getProductReview({ "sku": this.data.sku, "pagesize": "5", "pageno": "1" }).then((review) => {
                    this.productReview = review
                    this.noOfREView = this.productReview.data.reviews.length;
                    if (this.noOfREView != 0) {
                        this.reviewShow = true;
                    }
                });
                this.productData = res;
                this.spin = false;
                this.images = this.productData.data.data.media_images[0];
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
    gotoCart() {
        this._navCtrl.push(CartPage);
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
    submitReview() {
        let data = {
            sku: this.data.sku,
            "store_id": "1",
            "title": this.reviewDataTitle,
            "details": this.reviewDataDetails,
            "nickname": this.reviewDataNickname,
            "rating_options": {
                "1": this.reviewDataValue,
                "2": this.reviewDataQualty,
                "3": this.reviewDataPrice
            }
        };
        this._getProduct.getSubmitReview(data).then((res) => {
            this.submitReviewData = res;
            if (this.submitReviewData) {
                this.presentToast(this.submitReviewData.message);
            }
            console.log(this.submitReviewData);
        })
    }
    reviewChange(pageno: string) {
        this._getProduct.getProductReview({ "sku": this.data.sku, "pagesize": pageno, "pageno": "1" }).then((review) => {
            this.productReview = review
            this.noOfREView = this.productReview.data.reviews.length;
            if (this.noOfREView != 0) {
                this.reviewShow = true;
            }
        });
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
    reviewDetail() {
        this.reviewDisplay = true;
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
