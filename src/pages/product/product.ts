import { Component, OnInit } from '@angular/core';
import { CartPage } from '../cart/cart';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { ApiService } from './../../providers/api-service/api-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifyMe } from '../../model/product/notify';
import { CartService } from './../../providers/cart-service/cart-service';
import { productDataType } from './../product/productDataType';
import { Product } from '../../model/product/getProduct';
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
import { Transfer } from 'ionic-native';

@Component({
    selector: 'product',
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
    refDisplayPrice: number;
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
    customFormValidate: boolean = false;
    id: string;
    show_add_to_cart: any;// use to show offer
    userEmail: any;
    alertset: boolean = false;
    qty: number = 1;
    productid: string;
    additionalInformationData: any = [];
    customDisable: boolean = false;
    //gather data for send in add cart servive
    sku: string;
    img: string;
    name: string;
    type: string;
    bundlePrice: number;
    configPrice = [];
    addToCartData;
    valueBundle: boolean;
    bData: {};
    customPrice: number;
    customDisplayPrice: number;
    dynemicDisplayPrice: number;
    product_custom_option: any;
    config = true;
    product = "product";
    downlodeFormValidate = true;
    virtual = false;
    store_id: any;
    userData: any;
    groupedData: any;
    configSubData: any = {};
    cartSpin: boolean = false;
    constructor(private _tierPrice: TierPrice, private _notifyService: NotifyMe, private emailTest: FormBuilder, private _appConfigService: AppDataConfigService, private _toast: ToastService, public _events: Events, public _getProduct: Product, private _local: Storage, private _cartService: CartService, private _loadingCtrl: LoadingController, private _navCtrl: NavController, private _navParams: NavParams, private _apiService: ApiService) {
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
        this._appConfigService.getUserData().then((userData: any) => {
            this._local.get('store_id').then((store_id: any) => {
                this.userData = userData;
                this.store_id = store_id;
            })
            this.id = this._navParams.get('id');
            // coll products function when it lode first time
            this.products();
            //coll when any review is added 
            this._events.subscribe('api:review', (review) => {
                this.products();
            });
        })
    }
    products() {
        var self = this;
        // get data from local storage of userData via funtion of getUserData
        // in data variable access_token and sku is used to check user login in backend to send tier price
        if (this.userData) {
            this.data = {
                "sku": this.id,
                "access_token": this.userData.access_token
            };
        }
        else {
            this.data = {
                "sku": this.id
            };
        }
        //getProduct is use to fire product/get api to get product
        this._getProduct.getProduct(this.data).then((res) => {
            this.productData = res;
            if (res) {
                this.spin = false;
                this.product = this.productData.body.data.name;
                //                console.log(this.product)
                this.productid = this.productData.body.data.entity_id;
                this.images = this.productData.body.data.media_images[0];
                this.special_price = this.productData.body.data.special_price;
                this.display_price = this.productData.body.data.display_price;
                this.final_price = this.productData.body.data.final_price;
                this.refPrice = this.productData.body.data.final_price;
                this.refDisplayPrice = this.productData.body.data.display_price;
                this.bundlePrice = this.refPrice * 1;
                this.dynemicDisplayPrice = this.refDisplayPrice;
                //gather data for send in add cart servive
                this.sku = this.productData.body.data.sku;
                this.img = this.productData.body.data.media_images[0];
                this.name = this.productData.body.data.name;
                this.type = this.productData.body.data.type;
                let additionalInformation = this.productData.body.data.additional_information;
                this.product_custom_option = this.productData.body.data.product_custom_option;

                this.addToCartData = { productid: this.productData.body.data.entity_id, sku: this.sku, img: this.img, name: this.name, price: this.final_price, tier_price: this.tier_price, type: this.type, quantity: 1, qty: 1, "access_token": this.userData ? this.userData.access_token : "", "secret": this.userData ? this.userData.secret : "", "store_id": this.store_id };

                //get additional_information if exit
                if (additionalInformation != undefined) {
                    forEach(additionalInformation, function(value, key) {
                        if (value != false) {
                            self.additionalInformationData.push({
                                "key": key,
                                "value": value
                            });
                        }
                    })

                }
                // here we are using tierPrice servive to get offer of tire price .
                this.show_add_to_cart = this._tierPrice.getTierPriceData(this.productData.body.data.tier_price);
                if (this.type != "configurable" && this.type != "bundle" && this.type != "downloadable") {
                    this.disable = false;
                }
                if (this.productData.body.associated_products) {
                    console.log("hello")
                    this.keys = keys(this.productData.body.associated_products.attributes);
                    console.log(this.productData.body.associated_products, this.keys)
                }
                if (this.product_custom_option != undefined && this.product_custom_option.length > 0) {
                    this.customFormValidate = true;
                    this.customDisable = true;
                    this.virtual = false;
                    this.disable = true;
                }
                this.genrateData();
                this.ifCustomOption(null, null);
            }

        }, (err) => {
            this.error = true;
        }).catch((err) => {
        });

    }
    onChangeConfigurableAttribute(configurableSelectedObject, key) {
        let count = 0;
        var total = 0;
        let self = this;
        var flag = 0;
        this.configPrice = [];
        this.configSubData = {};
        //take current selected item
        let currentSelectedItem = configurableSelectedObject[key];
        //cloneing for use checked list in add cart function
        this.selectedList = clone(configurableSelectedObject);
        // get effected price
        forEach(configurableSelectedObject, (takePrice) => {
            ++flag;
            if (takePrice != undefined) {
                self.configPrice.push({ price: takePrice.price });
            }
        })
        forEach(this.configPrice, function(value: any) {
            total += (value.price * 1);
        });
        this.diffrentTypeProductData(total);
        //        mapping between select list

        forEach(this.productData.body.associated_products.attributes, (allConfigData, allConfigKey) => {
            if (key != allConfigKey) {
                forEach(allConfigData.options, (allConfigValue) => {
                    if (currentSelectedItem != undefined) {
                        allConfigValue.shown = false;
                        forEach(currentSelectedItem.products, (currentConfigProductsVal) => {
                            if (allConfigValue.products != undefined && currentConfigProductsVal != undefined) {
                                forEach(allConfigValue.products, (allConfigProductsVal) => {
                                    if (currentConfigProductsVal == allConfigProductsVal) {
                                        allConfigValue.shown = true;
                                    }
                                })
                            }
                        })
                    }
                })
            } else {
                forEach(allConfigData.options, (allConfigValue) => {
                    if (flag == 1) {
                        allConfigValue.shown = true;
                    }
                });
            }
            if (typeof configurableSelectedObject != undefined) {
                forEach(configurableSelectedObject, (value, key) => {
                    if (allConfigData.id == key) {
                        this.configSubData[allConfigData.label] = value;
                        if (allConfigData.label == "Color") {
                            let myDiv = document.getElementById('color');
                            myDiv.style.color = configurableSelectedObject[key] ? ((configurableSelectedObject[key].label).trim()).replace(" ", "") : "";
                        }
                    }
                });
            }
        })
        //change color of icon when its type is color
        this.selectshow = false;
        //disable button when select list is not checked
        if (typeof configurableSelectedObject != "undefined") {
            forEach(configurableSelectedObject, function(value) {
                count++;
            });
            if (this.keys.length == count) {
                if (this.customDisable == false) {
                    this.disable = false;
                }
                this.config = false;
            } else {
                if (this.customDisable == false) {
                    this.disable = true;
                }
                this.config = true;
            }
        }
        this.genrateData();
        this.configurabilData();
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

    }
    bundle(bundlePrice) {
        this.bundlePrice = this.refPrice * 1;
        this.dynemicDisplayPrice = this.refDisplayPrice * 1;
        this.bundlePrice += bundlePrice * 1;
        this.dynemicDisplayPrice += bundlePrice * 1;
        this.final_price = this.bundlePrice;
        this.display_price = this.dynemicDisplayPrice;
    }
    //configurabilData
    configurabilData() {
        let array: any = {};
        let selectedItem: string;

        if (this.type == "configurable") {
            forEach(this.selectedList, function(listdata, key) {
                array[key] = listdata.id;
            });
            selectedItem = (array);
            let cartApiData = { "productid": this.productid, "qty": this.qty, "options": selectedItem, "subData": this.configSubData };
            this.addToCartData = merge(this.addToCartData, cartApiData);
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
            //            this.cartApi(this.cartApiData, this.keys);//will change
        }
    }
    customOptData;
    diffProductData;
    //simple+vertual+downloadble 
    ifCustomOption(customOpt, diffProduct) {
        if (diffProduct != null) {
            this.diffProductData = diffProduct;
        }
        if (customOpt != null) {
            this.customOptData = customOpt;
        }
        if (!this.disable) {
            this.addToCartData = merge(this.addToCartData, this.customOptData, this.diffProductData);
        }
    }

    addToCartService() {
        this.cartSpin = true;
        this._cartService.addCart(this.addToCartData).then((response: any) => {
            this.cartData = response;
            this.cartSpin = false;
            if (this.cartData.body != undefined) {
                this._toast.toast("item inserted ", 3000, "top");
                this._navCtrl.push(CartPage);
            }
            else {
            }
        }, (err) => {
            this.cartSpin = false;
        });
    }

    diffrentTypeProductData(data?) {
        if (this.customPrice != undefined) {
            this.bundlePrice = this.customPrice * 1;
        }
        else {
            this.bundlePrice = this.refPrice * 1;
        }
        this.dynemicDisplayPrice = this.refDisplayPrice * 1;
        this.customFormValidate = data.disable;
        if (this.type != 'configurable' && this.type != 'bundle') {
            if (this.type == 'downloadable') {
                if (data.disable == false) {
                    this.ifCustomOption(null, data)
                }
                if (data.disable == false && this.customDisable == false) {
                    this.disable = false;
                    this.downlodeFormValidate = data.disable;
                }
                else {
                    this.disable = true;
                    this.downlodeFormValidate = data.disable;
                }
            }
            else {
                if (data.disable == false) {
                    this.ifCustomOption(null, data);
                }
                this.disable = data.disable;
            }
            this.bundlePrice += data.dynemicPrice * 1;
            this.dynemicDisplayPrice += data.dynemicPrice * 1;
        }
        else if (this.type == 'bundle') {
            this.disable = data.disable;
            this.bundlePrice += data.total * 1;
            this.dynemicDisplayPrice += data.total * 1;
            if (data.disable == false) {
                //                console.log("bundalData",data)
                this.ifCustomOption(null, data);
            }
        }
        else {
            if (data) {
                this.bundlePrice += data * 1;
                this.dynemicDisplayPrice += data * 1;
            }
        }
        this.final_price = this.bundlePrice;
        this.display_price = this.dynemicDisplayPrice;
    }

    customData(customData) {
        this.customPrice = this.bundlePrice * 1;
        this.customDisplayPrice = this.refDisplayPrice * 1;
        //        this.disable = customData.disable;
        this.customDisable = customData.disable;
        if (this.type == 'configurable') {
            if (this.config == false && customData.disable == false) {
                this.disable = false;
            }
            else {
                this.disable = true;
            }
        } else if (this.type == 'downloadable') {
            if (this.downlodeFormValidate == false && customData.disable == false) {
                this.disable = false;
            }
            else {
                this.disable = true;
            }
        } else if (this.type == 'virtual') {
            this.disable = customData.disable;
        }
        else if (this.type == 'simple') {
            this.disable = customData.disable;
        }
        else {
            this.disable = true;
        }
        if (customData.disable == false) {
            this.ifCustomOption(customData, null);
        }
        this.customPrice += customData.dynemicPrice * 1;
        this.customDisplayPrice += customData.dynemicPrice * 1;
        //        this.display_price = this.;
        this.final_price = this.customPrice;
        this.display_price = this.customDisplayPrice;
    }

    group(groupData) {
        let total = (this.refPrice * 1) + (groupData.total * 1);
        console.log(this.refPrice)
        this.final_price = total;
        this.groupedData = groupData;
        this.disable = groupData.disable;
        if (groupData.disable == false) {
            this.addToCartData = merge(this.addToCartData, groupData);
        }
    }

}



