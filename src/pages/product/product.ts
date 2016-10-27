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
    quantity: number;
    sp_priceShow: boolean = false;
    visiable: boolean = false;
    selectshow: boolean = true;
    spin: boolean = true;
    itemSize: string;
    itemColor: string;
    selectSize: string;
    selectColor: string;
    attribute: any = [];
    selectedList: any = [];
    disable: boolean = true;
    product: string;
    price: number;
    shown: boolean;
    images: string;
    final_price: number;
    item: any;
    keys: any = [];
    search: any = [];
    res: {} = {};
    data: any;
    constructor(private _cart: Cart, private _getProduct: Product, private _local: Storage, private _cartService: CartService, private _toastCtrl: ToastController, private _loadingCtrl: LoadingController, private _navCtrl: NavController, private _navParams: NavParams, private _apiService: ApiService) {
        let id = _navParams.get('id');
        this.data = { sku: id };
    }
    ngOnInit() {
        this.product = "Product";
        this.presentLoading();
        this._getProduct.getProduct(this.data).then((res) => {
            if (res) {
                this.visiable = true;
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
    slideClick(img) {
        this.images = img;
    }
    addCart(response) {
        let selectedItem: string;
        let array: any = {};
        let path: any;
        let data: any;
        let check;
        //gather data for send in add cart servive
        let sku: string = response.data.sku;
        let img: string = response.data.media_images[0];
        let price: number = response.data.display_price;
        let name: string = response.data.name;
        let type: string = this.productData.data.data.type;
        let access_token: string;
        let store_id: string;
        let other;
        let productid: string = this.productData.data.data.entity_id;
        this._local.get('access_token').then((value: any) => {
            access_token = value;

            this._local.get('store_id').then((store_idval: any) => {
                store_id = store_idval;
                data = { id: sku, img: img, name: name, price: price, type: type, quantity: 1 };
                other = data;
                //check type of data for send data in cart api
                if (type == "configurable") {
                    forEach(this.selectedList, function(listdata, key) {
                        array[key] = listdata.id;
                    });
                    selectedItem = (array);
                    path = { "productid": productid, "options": selectedItem, "access_token": access_token, "secret": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcHAubWFnZW50by5leGNlbGxlbmNlIiwiYXVkIjoibW9iaWxlX2FwcCJ9.R4eQ8HCunGPktBEMAVpt6B5IDFGrvgTEuzCKnsykQEY", "store_id": store_id };
                    other = merge(data, selectedItem);
                    let ser = this.productData.data.associated_products.attributes;
                    this._local.get('search').then((search: any) => {
                        if (search) {
                            this.search = search;
                            this.search.push(ser);
                            console.log(this.search);
                            this._local.set('search', uniqWith(this.search, isEqual));
                        }
                        else {
                            this.search.push(ser);
                            this._local.set('search', uniqWith(this.search, isEqual));
                        }

                    });
                }
                else {
                    path = { "productid": productid, "access_token": access_token, "secret": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcHAubWFnZW50by5leGNlbGxlbmNlIiwiYXVkIjoibW9iaWxlX2FwcCJ9.R4eQ8HCunGPktBEMAVpt6B5IDFGrvgTEuzCKnsykQEY", "store_id": store_id };
                }

                //cart api
                this._cart.getCart(path).then((res) => {
                    if (res) {
                        //add to cart service
                        this._cartService.addCart(other, this.keys).then((response: any) => {
                            if (response != "undefined") {
                                this.item = response;
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
    }
}
