import { Component} from '@angular/core';
import { cartpage } from '../cart/cart';
import { NavController, NavParams, Storage, LocalStorage} from 'ionic-angular';
import {FormService} from './../../providers/form-service/form-service';
import { cartService } from './../../providers/form-service/cartService';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
@Component({
    templateUrl: 'build/pages/product/product.html',
    providers: [FormService, cartService]
})
export class productpage {
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
    selectColor: any;
    attribute: any = [];
    selectedList: any = [];
    storage;
    disable: boolean = true;
    product;
    price;
    s_price;
    shown;
    images: any;
    final_price;
    rest;
    item;
    keys: any = [];
    secret: any;
    access_token: any;
    constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, private navCtrl: NavController, private navParams: NavParams, private _cartService: cartService, private _formService: FormService) {
        this.product = "Product";
        this.secret = localStorage.getItem('secret');
        this.access_token = localStorage.getItem('access_token');
        let id = navParams.get('id');
        this.presentLoading();
        let path = { sku: id };
        this._formService.api("product/get/", path).subscribe((res) => {
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
                    var list = this.response.data.associated_products.attributes;
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
    gotocart() {
        this.navCtrl.push(cartpage);
    }
    onChange(res, key) {
        var count = 0;
        //take current selected item
        var res111 = res[key];
        //cloneing for use checked list in add cart function
        this.selectedList = _.clone(res);
        //mapping between select list
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
    addcart(response) {
        var selectedItem: any;
        var array = {};
        var path: any;
        var data: any;
        var check;
        var count = 0;
        //gather data for send in add cart servive
        var sku = response.data.sku;
        var img = response.data.media_images[0];
        var price = response.data.display_price;
        var name = response.data.name;
        var type = this.response.data.data.type;
        var productid = this.response.data.data.entity_id;
        data = { id: sku, img: img, name: name, price: price, type: type, quantity: 1 };
        other = data;
        //check type of data for send data in cart api
        if (type == "simple") {
            path = { "productid": productid, "access_token": this.access_token, "secret": this.secret };
        }
        if (type == "configurable") {
            _.forEach(this.selectedList, function(listdata, key) {
                array[key] = listdata.id;
            });
            selectedItem = (array);
            path = { "productid": productid, "options": selectedItem, "access_token": this.access_token, "secret": this.secret };
            var other = _.merge(data, selectedItem);
        }
        //cart api
        this._formService.api("cart/cart", path).subscribe((res) => {
            if (res) {
                //add to cart service
                this._cartService.addCart(other, this.keys).then((response) => {
                    this.item = response;
                    this.presentToast("item inserted ");
                    this.navCtrl.push(cartpage);
                });
            }
        },
            (err) => {
                if (err) {
                    this.presentToast(err);
                    console.log(err);
                }
            });
    }
}

