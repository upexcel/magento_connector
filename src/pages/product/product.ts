import { Component, OnInit} from '@angular/core';
import { CartPage } from '../cart/cart';
import { NavController, NavParams } from 'ionic-angular';
import { FormService } from './../../providers/form-service/form-service';
import { CartService } from './../../providers/form-service/cartService';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import _ from 'lodash';
@Component({
    templateUrl: 'product.html'
})
export class ProductPage {
    res: {} = {};
    quantity: number;
    response: any;
    activeSize: boolean = false;
    activeColor: boolean = false;
    quantityUpdate: boolean = false;
    condition: boolean = false;
    sp_priceShow: boolean = false;
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
    s_price: number;
    shown: boolean;
    images: string;
    final_price: number;
    item: any;
    keys: any = [];
    search: any = [];
    searchTransformation: any = [];
    path: any;
    constructor(public local: Storage, public _cartService: CartService, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public _formService: FormService) {
        let id = navParams.get('id');
        this.path = { sku: id };
    }
    ngOnInit() {
        this.product = "Product";
        this.presentLoading();
        this._formService.api("product/get/", this.path).subscribe((res) => {
            if (res) {
                this.response = JSON.parse(res.data);
                this.spin = false;
                this.price = this.response.data.data.display_price;
                this.images = this.response.data.data.media_images[0];
                this.final_price = this.price;
                if (this.response.data.data.type != "configurable") {
                    this.disable = false;
                }
                if (this.response.data.data.special_price > 0) {
                    this.condition = true;
                    this.sp_priceShow = true;
                    this.s_price = this.response.data.data.special_price;
                    this.final_price = this.s_price;
                }
                this.product = this.response.data.data.name;
                if (this.response.data.associated_products) {
                    let list: string = this.response.data.associated_products.attributes;
                    this.keys = _.keys(list);
                }
            }
        },
            (err) => {
                if (err) {
                    console.log(err);
                }
            })
    }

    gotoCart() {
        this.navCtrl.push(CartPage);
    }
    onChange(res, key) {
        let count = 0;
        //take current selected item
        let res111 = res[key];
        //cloneing for use checked list in add cart function
        this.selectedList = _.clone(res);
        //        mapping between select list
        _.forEach(this.response.data.associated_products.attributes, function(res1, key1) {
            if (key != key1) {
                _.forEach(res1.options, function(res2) {
                    res2.shown = false;
                    _.forEach(res111.products, function(res4) {
                        _.forEach(res2.products, function(res3) {
                            if (res4 == res3) {
                                res2.shown = true;
                            }
                        })
                    })
                })
            }
            else {
                _.forEach(res1.options, function(res2) {
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
            _.forEach(res, function(value) {
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
        let loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 2000
        });
        loader.present();
    }
    presentToast(message: string) {
        let toast = this.toastCtrl.create({
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
        let type: string = this.response.data.data.type;
        let access_token: string;
        let store_id: string;
        let productid: string = this.response.data.data.entity_id;
        this.local.get('access_token').then((value: any) => {
            access_token = value;

            this.local.get('store_id').then((store_idval: any) => {
                store_id = store_idval;
                data = { id: sku, img: img, name: name, price: price, type: type, quantity: 1 };
                let other = data;
                //check type of data for send data in cart api
                if (type == "configurable") {
                    _.forEach(this.selectedList, function(listdata, key) {
                        array[key] = listdata.id;
                    });
                    selectedItem = (array);
                    path = { "productid": productid, "options": selectedItem, "access_token": access_token, "secret": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcHAubWFnZW50by5leGNlbGxlbmNlIiwiYXVkIjoibW9iaWxlX2FwcCJ9.R4eQ8HCunGPktBEMAVpt6B5IDFGrvgTEuzCKnsykQEY", "store_id": store_id };
                    let other = _.merge(data, selectedItem);
                    let ser = this.response.data.associated_products.attributes;
                    this.local.get('search').then((search: any) => {
                        if (search) {
                            this.search=search;
                            this.search.push(ser);
                            this.local.set('search', _.uniqWith(this.search, _.isEqual));
                        }
                        else {
                            this.search.push(ser);
                            this.local.set('search', _.uniqWith(this.search, _.isEqual));
                        }

                    }
                }
                else {
                    path = { "productid": productid, "access_token": access_token, "secret": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcHAubWFnZW50by5leGNlbGxlbmNlIiwiYXVkIjoibW9iaWxlX2FwcCJ9.R4eQ8HCunGPktBEMAVpt6B5IDFGrvgTEuzCKnsykQEY", "store_id": store_id };
                }

                //cart api
                this._formService.api("cart/cart", path).subscribe((res) => {
                    if (res) {
                        //add to cart service
                        this._cartService.addCart(other, this.keys).then((response: any) => {
                            console.log("response");
                            if (response != "undefined") {
                                this.item = response;
                                this.presentToast("item inserted ");
                                this.navCtrl.push(CartPage);
                            }
                            else {
                            }
                        });
                    }
                },
                    (err) => {
                        if (err) {
                            this.presentToast(err);
                            console.log(err);
                        }
                    });

            });
        });
    }
}
