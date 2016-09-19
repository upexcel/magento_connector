import { Component} from '@angular/core';
import { cartpage } from '../cart/cart';
import { NavController, NavParams, Storage, LocalStorage} from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import {filter} from '../pipe/pipe';
import * as _ from 'lodash';
@Component({
    templateUrl: 'build/pages/product/product.html',
    providers: [FormService],
    pipes: [filter]
})
export class productpage {
    res: {} = {};
    quantity: number = 1;
    response: any;
    backupResponse: any;
    activeSize: boolean = false;
    activeColor: boolean = false;
    quantityUpdate: boolean = false;
    condition: boolean = false;
    sp_priceShow: boolean = false;
    selectshow: boolean = true;
    itemSize: string;
    itemColor: string;
    selectSize: string;
    selectColor: any;
    attribute: any = [];
    storage;
    product;
    price;
    s_price;
    shown;
    images: any;
    final_price;
    rest;
    keys: any = [];
    constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, private navCtrl: NavController, private navParams: NavParams, private _formService: FormService) {
        this.product = "Product";
        let id = navParams.get('id');
        this.presentLoading();
        let path = { sku: id };

        this._formService.api("product/get/", path).subscribe((res) => {
            if (res) {
                this.response = JSON.parse(res.data.body);
                this.backupResponse = this.response;
                this.price = this.response.data.data.display_price;
                this.images = this.response.data.data.media_images[0];
                this.final_price = this.price;
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
    addcart(response) {
        this.presentToast("item inserted ");
        var sku = response.sku;
        var img = response.media_images;
        var price = response.display_price;
        var name = response.name;
        let data = { id: sku, no: this.quantity, img: img, name: name, price: price, size: this.itemSize, qty: this.quantity };
        this.storage = JSON.parse(localStorage.getItem('item'));
        this.navCtrl.push(cartpage, data);

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

    onChange(res, key) {
        var res111 = res[key];
        _.forEach(this.response.data.associated_products.attributes, function(res1, key1) {
            if (key != key1) {
                _.forEach(res1.options, function(res2, key2) {
                    res2.shown = false;
                    _.forEach(res111.products, function(res4, key4) {
                        _.forEach(res2.products, function(res3, key3) {
                            if (res4 == res3) {
                                res2.shown = true;
                            }
                        })


                    })

                })
            }
            else {
                _.forEach(res1.options, function(res2, key2) {
                    res2.shown = true;
                });
            }
        })
        this.selectshow = false;
        let myDiv = document.getElementById('color');
        myDiv.style.color = res[key].label;

    }
}