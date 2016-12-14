import { Component, Input, OnInit } from '@angular/core';
import { CartPage } from '../cart/cart';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { ApiService } from './../../providers/api-service/api-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifyMe } from '../../model/product/notify';
import { CartService } from './../../providers/cart-service/cart-service';
import { productDataType } from './../product/productDataType';
import { Product } from '../../model/product/getProduct';
import { Cart } from '../../model/product/cart';
import { cartDataType } from './../product/cartDataType';
import { ToastService } from './../../providers/toast-service/toastService';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';
import { TierPrice } from '../../model/product/checkTierPrice';
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
    logform: FormGroup;
    cartData: cartDataType;
    quantity: number;
    selectshow: boolean = true;
    spin: boolean = true;
    itemSize: string;
    itemColor: string;
    selectSize: string;
    selectColor: string;
    selectedList: Array<any> = [];
    disable: boolean = true;
    images: string;
    final_price: number;
    refPrice: number;
    display_price: number;
    special_price: number;
    tier_price: Array<any>;
    keys: Array<string> = [];
    search: any = [];
    res: {} = {};
    imgArray: Array<string> = [];
    data: any;
    reviewData = [];
    error: boolean = false;
    id: string;
    show_add_to_cart: any;// use to show offer
    userEmail: any;
    alertset: boolean = false;
    qty: number = 1;
    productid: string;
    //gather data for send in add cart servive
    sku: string;
    img: string;
    name: string;
    type: string;
    path: any;
    bundlePrice: number;
    configPrice = [];
    other;

    constructor(private _tierPrice: TierPrice, private _notifyService: NotifyMe, private emailTest: FormBuilder, private _appConfigService: AppDataConfigService, private _toast: ToastService, public _events: Events, private _cart: Cart, private _getProduct: Product, private _local: Storage, private _cartService: CartService, private _loadingCtrl: LoadingController, private _navCtrl: NavController, private _navParams: NavParams, private _apiService: ApiService) {
        this.logform = this.emailTest.group({ email: ['', Validators.required] });
        this._appConfigService.getUserData().then((userData: any) => {
            if (userData) {
                this.userEmail = userData.email;
            } else {
                this.userEmail = '';
            }
        })
    }
    ngOnInit() {
        this.id = this._navParams.get('id');
        // coll products function when it lode first time
        this.products();
        //coll when any review is added 
        this._events.subscribe('api:review', (review) => {
            this.products();
        });
    }
    products() {
        // get data from local storage of userData via funtion of getUserData
        this._appConfigService.getUserData().then((userData: any) => {
            // in data variable access_token and sku is used to check user login in backend to send tier price
            if (userData) {
                this.data = {
                    "sku": this.id,
                    "access_token": userData.access_token
                };
            }
            else {
                this.data = {
                    "sku": this.id
                };
            }
            //getProduct is use to fire product/get api to get product 
            this._getProduct.getProduct(this.data).then((res) => {
                //            this._getProduct.getProduct({ sku: "hbm010", access_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYWdlbnRvIiwiYXVkIjoiY29tLnRldGhyIiwiaWF0IjoxNDgxMTA2NjAwLCJuYmYiOiIyMDE2LTEyLTE0IDEwOjMwOjAwIn0.QZXWtectrWjL_et3aQFmWMRkWm1kEjN6lPtrZoHrF-o" }).then((res) => {
                this.productData = res;
                if (res) {
                    this.spin = false;
                    this.productid = this.productData.body.data.entity_id;
                    this.images = this.productData.body.data.media_images[0];
                    this.special_price = this.productData.body.data.special_price;
                    this.display_price = this.productData.body.data.display_price;
                    this.final_price = this.productData.body.data.final_price;
                    this.refPrice = this.productData.body.data.final_price;
                    //gather data for send in add cart servive
                    this.sku = this.productData.body.data.sku;
                    this.img = this.productData.body.data.media_images[0];
                    this.name = this.productData.body.data.name;
                    this.type = this.productData.body.data.type;
                    // here we are using tierPrice servive to get offer of tire price .
                    this.show_add_to_cart = this._tierPrice.getTierPriceData(this.productData.body.data.tier_price);
                    if (this.type != "configurable" && this.type != "bundle" && this.type != "downloadable") {
                        this.disable = false;
                    }
                    if (this.productData.body.associated_products) {
                        this.keys = keys(this.productData.body.associated_products.attributes);
                    }
                    this.genrateData();
                }
            }).catch((err) => {
                this.error = true;
            });
        }).catch((err) => {
        })
    }
    onChangeConfigurableAttribute(res, key) {
        let count = 0;
        var total = 0;
        let self = this;
        this.configPrice = [];
        //take current selected item
        let res111 = res[key];
        //cloneing for use checked list in add cart function
        this.selectedList = clone(res);
        // get effected price
        forEach(res, function(takePrice) {
            self.configPrice.push({ price: takePrice.price });
        })

        forEach(this.configPrice, function(value: any) {
            total += (value.price * 1);
        });
        this.calcultateData(total);
        //        mapping between select list

        forEach(this.productData.body.associated_products.attributes, function(res1, key1) {

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
            } else {
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
            } else {
                this.disable = true;
            }
        }
        this.genrateData();
    }
    slideClick(img: string) {
        this.images = img;
    }
    userUpdated(event) {
        this.reviewData = event;
    }
    public askEmail: boolean;

    notifySet() { // this function is used to set notification for product stock
        if (this.userEmail) {
            this.alertSetApi(this.userEmail)
        } else {
            this._toast.toast("Please Login First !!", 3000, "bottom");
        }
    }
    alertSetApi(useremail) {
        this.alertset = true;
        let sku = this.productData.body.data.sku;
        let email = useremail
        this._notifyService.setNotification(sku, email).then((data: any) => {
            this.alertset = false;
            this.askEmail = true;

        });
    }

    genrateData(price?) {
        let array: any = {};
        let selectedItem: string;
        let data: any;
        let testPrice;
        this._appConfigService.getUserData().then((userData: any) => {
            this._local.get('store_id').then((store_id: any) => {
                data = { id: this.sku, img: this.img, name: this.name, price: this.final_price, tier_price: this.tier_price, type: this.type, quantity: 1 };
                this.other = clone(data);

                //check type of data for send data in cart api
                if (this.type == "configurable") {
                    forEach(this.selectedList, function(listdata, key) {
                        array[key] = listdata.id;
                    });
                    selectedItem = (array);
                    this.path = { "productid": this.productid, "qty": this.qty, "options": selectedItem, "access_token": userData.access_token, "secret": userData.secret, "store_id": store_id };
                    this.other = merge(data, selectedItem);
                    let ser = this.productData.body.associated_products.attributes;
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
                //bundleproduct
                else if (this.type == "bundle") {

                }
                else {
                    this.path = { "productid": this.productid, "access_token": userData.access_token, "secret": userData.secret, "store_id": store_id };
                }
            })
        });
    }

    addCart(response) {
        let other;
        //cart api
        this._cart.getCart(this.path).then((res) => {
            if (res) {
                // add to cart service
                this._cartService.addCart(other, this.keys).then((response: any) => {
                    this.cartData = response;
                    if (this.cartData.body != "undefined") {
                        this._toast.toast("item inserted ", 3000, "top");
                        this._navCtrl.push(CartPage);
                    }
                    else {
                    }
                });
            }
        }).catch((err) => {
            this._toast.toast(err, 3000, "top");
        });
    }
    calcultateData(data?) {
        this.bundlePrice = this.refPrice * 1;
        if (this.type != 'configurable' && this.type != 'bundle') {
            data = merge(data, this.other, this.path);
            this.disable = data.disable;
            this.bundlePrice += data.dynemicPrice * 1;
        }
        else if(this.type == 'bundle'){
            
         this.bundlePrice += data * 1;
        }
        else {
            this.bundlePrice += data * 1;
        }
        this.final_price = this.bundlePrice;
    }
}