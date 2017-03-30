import { Component, OnInit } from '@angular/core';
import { CartPage } from '../cart/cart';
import { NavController, NavParams, Events, ViewController } from 'ionic-angular';
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
import keys from 'lodash/keys';
import merge from 'lodash/merge';
import { Transfer } from 'ionic-native';
import { WishListService } from '../../providers/wishList/wishList-service';
import { config } from './../../providers/config/config';
import { ModalController } from 'ionic-angular';
import { WishListModel } from './../../model/wishList/wishList';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LoadingController } from 'ionic-angular';

@Component({
    selector: 'product',
    templateUrl: 'product.html'
})
export class ProductPage implements OnInit {
    productData: productDataType;
    logform: FormGroup;
    cartData: cartDataType;
    selectshow: boolean = true;
    spin: boolean = true;
    selectedList: Array<any> = [];
    disable: boolean = true;
    images: string;
    final_price: number;
    refPrice: any;
    refDisplayPrice: number;
    display_price: any;
    special_price: number;
    tier_price: Array<any>;
    keys: Array<string> = [];
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
    bundlePrice: any;
    configPrice = [];
    addToCartData;
    customPrice: any;
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
    configSubData: any = [];
    cartSpin: boolean = false;
    customOptData;
    diffProductData;
    editCartData: any;
    cartButtonTitle: string;
    add_cart = {};
    mySlideOptions = config.productSliderOptions;
    constructor(public loadingCtrl: LoadingController, public _socialSharing: SocialSharing, public _wishList: WishListModel, public _modalCtrl: ModalController, public _wishListService: WishListService, private viewCtrl: ViewController, private _tierPrice: TierPrice, private _notifyService: NotifyMe, private emailTest: FormBuilder, private _appConfigService: AppDataConfigService, private _toast: ToastService, public _events: Events, public _getProduct: Product, private _local: Storage, private _cartService: CartService, private _navCtrl: NavController, private _navParams: NavParams, private _apiService: ApiService) {
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
            this.editCartData = this._navParams.get('editCartData');
            if (this.editCartData && !this._navParams.get('wishlist')) {
                this.cartButtonTitle = 'UPDATE CART'
            } else {
                this.cartButtonTitle = 'ADD TO CART'
            }
            // coll products function when it lode first time
            this.products();
            //coll when any review is added 
            this._events.subscribe('api:review', (review) => {
                this.products();
            });
        })
    }
    shareWithOptions(caption, img) {
        let opt = {
            message: 'share this',
            subject: caption,
            files: img,
            url: 'https://www.website.com/foo/#bar?a=b',
            chooserTitle: 'Pick an app'
        }
        this._socialSharing.shareWithOptions(opt)
            .then(() => console.log('Shared!'))
            .catch((error: any) => console.error(error));
        let loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 4000
        });
        loader.present();
    }
    wishList(feat_prod) {
        let data = {};
        data["productId"] = feat_prod.data.entity_id;
        data["secret"] = this.userData ? this.userData.secret : "";
        if (this.type != "grouped") {
            data["qty"] = 1;
            if (this.type == 'configurable') {
                data["super_attribute"] = this.add_cart['super_attribute'];
            } else if (this.type == "downloadable") {
                data["links"] = this.add_cart['links'];
            }
            else if (this.type == "bundle") {
                data["bundle_option_qty"] = this.add_cart['bundle_option_qty'];
                data["bundle_option"] = this.add_cart['bundle_option'];
            }
        } else {
            data["qty"] = 0;
            data["super_group"] = this.add_cart['super_attribute'];
        }
        feat_prod = merge(feat_prod, this.add_cart);
        this._appConfigService.getUserData().then((userData: any) => {
            if (userData && userData.access_token != null) {
                this._wishListService.setWishListData(feat_prod, data);
                if(feat_prod.data.wishlist_item_id){
                    feat_prod.data.wishlist_item_id = false;
                } else{
                    feat_prod.data.wishlist_item_id = true;
                }
            } else {
                this._toast.toast("Please login first", 3000);
            }
        });
    }

    products() {
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
                this.productid = this.productData.body.data.entity_id;
                this.images = this.productData.body.data.media_images[0];
                this.special_price = this.productData.body.data.special_price;
                this.display_price = this.productData.body.data.display_price;
                this.final_price = this.productData.body.data.final_price;
                this.refPrice = this.productData.body.data.final_price;
                this.refDisplayPrice = this.productData.body.data.display_price;
                this.bundlePrice = parseFloat(this.refPrice);
                this.dynemicDisplayPrice = this.refDisplayPrice;
                //gather data for send in add cart servive
                this.sku = this.productData.body.data.sku;
                this.img = this.productData.body.data.media_images[0];
                this.name = this.productData.body.data.name;
                this.type = this.productData.body.data.type;
                let additionalInformation = this.productData.body.data.additional_information;
                this.product_custom_option = this.productData.body.data.product_custom_option;

                this.addToCartData = { productid: this.productData.body.data.entity_id, sku: this.sku, "currency_sign": this.productData.body.data.currency_sign, img: this.img, name: this.name, total: this.final_price, tier_price: this.tier_price, type: this.type, quantity: 1, qty: 1, "access_token": this.userData ? this.userData.access_token : "", "secret": this.userData ? this.userData.secret : "", "store_id": this.store_id };
                //get additional_information if exit
                if (additionalInformation != undefined) {
                    forEach(additionalInformation, (value, key) => {
                        if (value != false) {
                            this.additionalInformationData.push({
                                "key": key,
                                "value": value
                            });
                        }
                    })

                }
                if (this.productData.body.associated_products) {
                    this.keys = keys(this.productData.body.associated_products.attributes);
                    if (this.keys.length == 0) {
                        this.disable = false;
                    }
                }
                //add a vertual key
                if (this.editCartData) {
                    if (this.editCartData.type != "configurable" && this.editCartData.type != "bundle" && this.editCartData.type != "downloadable") {
                        this.disable = false;
                        this.add_cart = merge(this.add_cart, this.addToCartData);
                    }
                    if (Object.keys(this.productData.body.associated_products.attributes).length > 0) {
                        forEach(this.productData.body.associated_products.attributes, (attributesData, attributesDataKey) => {
                            forEach(this.editCartData.super_attribute, (opt, opt_key) => {
                                if (opt_key == attributesDataKey) {
                                    forEach(attributesData.options, (optionData) => {
                                        if (optionData.id == opt) {
                                            attributesData.vertualKey = optionData;
                                            optionData.shown = true;
                                            this.onChangeConfigurableAttribute(optionData, attributesData.id);
                                            this.disable = false;
                                        }
                                    })
                                }
                            })
                        });
                    }
                } else {
                    if (this.productData.body.associated_products) {
                        if (Object.keys(this.productData.body.associated_products.attributes).length > 0) {
                            forEach(this.productData.body.associated_products.attributes, (attributesData) => {
                                attributesData.vertualKey = false;
                            });
                        }
                    }
                }

                // here we are using tierPrice servive to get offer of tire price .
                this.show_add_to_cart = this._tierPrice.getTierPriceData(this.productData.body.data.tier_price);
                if (this.type != "configurable" && this.type != "bundle" && this.type != "downloadable") {
                    this.disable = false;
                }
                if (this.product_custom_option != undefined && this.product_custom_option.length > 0) {
                    this.customFormValidate = true;
                    this.customDisable = true;
                    this.virtual = false;
                    this.disable = true;
                }
                this.ifCustomOption(null, null);
            }

        }, (err) => {
            this.error = true;
        }).catch((err) => {
        });

    }
    onChangeConfigurableAttribute(configurableSelectedObject, key) {
        if (!configurableSelectedObject) {
            return;
        }
        let count = 0;
        var total = 0;
        var flag = 0;
        this.configPrice = [];
        this.selectedList = [];
        this.configSubData = [];
        //mapping between select list
        forEach(this.productData.body.associated_products.attributes, (allConfigData, allConfigKey) => {
            if (typeof (allConfigData.vertualKey) == 'object') {
                ++flag;
                count++;
                this.configPrice.push({ price: allConfigData.vertualKey.price });
                this.selectedList.push(allConfigData);
                this.configSubData.push({
                    key: allConfigData.label,
                    value: allConfigData.vertualKey
                });
                if (allConfigData.label == "Color") {
                    setTimeout(() => {
                        let myDiv = document.getElementById('color');
                        myDiv.style.color = ((allConfigData.vertualKey.label).trim()).replace(" ", "") || "";
                    }, 100)
                }
            }
            if (key != allConfigKey) {
                forEach(allConfigData.options, (allConfigValue) => {
                    allConfigValue.shown = false;
                    forEach(configurableSelectedObject.products, (currVal) => {
                        forEach(allConfigValue.products, (allConfigProductsVal) => {
                            if (currVal == allConfigProductsVal) {
                                allConfigValue.shown = true;
                            }
                        })
                    })
                })
            } else {
                forEach(allConfigData.options, (allConfigValue) => {
                    if (flag == 1) {
                        allConfigValue.shown = true;
                    }
                })
            }
        })
        forEach(this.configPrice, (value: any) => {
            total += (parseFloat(value.price));
        });
        this.diffrentTypeProductData(total);
        this.selectshow = false;
        //disable button when select list is not checked
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
        this.configurabilData();
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
        let email = useremail;
        this._notifyService.setNotification(sku, email).then((data: any) => {
            this._toast.toast(data.body.message, 3000, "bottom");
            this.alertset = false;
            this.askEmail = true;
        });
    }

    //    bundle(bundlePrice) {
    //        this.bundlePrice = parseFloat(this.refPrice);
    //        this.dynemicDisplayPrice = this.refDisplayPrice;
    //        this.bundlePrice += (parseFloat(bundlePrice));
    //        this.dynemicDisplayPrice += (parseFloat(bundlePrice));
    //        this.final_price = (parseFloat(this.bundlePrice));
    //        console.log("final",this.final_price)
    //        this.display_price = this.dynemicDisplayPrice;
    //    }
    //configurabilData
    configurabilData() {
        let array: any = {};
        this.add_cart = {};
        let selectedItem: string;
        if (this.type == "configurable") {
            forEach(this.selectedList, function(listdata) {
                array[listdata.id] = listdata.vertualKey.id;
            });
            selectedItem = (array);
            let cartApiData = { "productid": this.productid, "qty": this.qty, "super_attribute": selectedItem, "subData": this.configSubData };
            this.add_cart = merge(this.add_cart, this.addToCartData, cartApiData);
            this.ifCustomOption("", this.add_cart)
        }
    }
    //simple+vertual+downloadble 
    ifCustomOption(customOpt, diffProduct) {
        this.add_cart = {};
        if (diffProduct != null) {
            this.diffProductData = diffProduct;
        }
        if (customOpt != null) {
            this.customOptData = customOpt;
        }
        setTimeout(() => {
            if (!this.disable) {
                this.add_cart = merge(this.add_cart, this.addToCartData, this.customOptData, this.diffProductData);
            }
        })
    }

    diffrentTypeProductData(data?) {
        if (this.customPrice != undefined) {
            this.bundlePrice = parseFloat(this.customPrice);
        }
        else {
            this.bundlePrice = this.refPrice;
        }
        this.dynemicDisplayPrice = this.refDisplayPrice;
        this.customFormValidate = data.disable;
        if (this.type != 'configurable' && this.type != 'bundle') {
            if (this.type == 'downloadable') {
                console.log("data", data)
                if (data.disable == false) {
                    this.ifCustomOption(null, data);
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
            this.bundlePrice += (parseFloat(data.dynemicPrice));
            this.dynemicDisplayPrice += (parseFloat(data.dynemicPrice));
        }
        else if (this.type == 'bundle') {
            this.disable = data.disable;
            this.bundlePrice = (parseFloat(this.bundlePrice)) + (parseFloat(data.total));
            this.dynemicDisplayPrice += (parseFloat(data.total));
            if (data.disable == false) {
                this.ifCustomOption(null, data);
            }
        }
        else {
            if (data) {
                this.bundlePrice = (parseFloat(this.bundlePrice)) + (parseFloat(data));
                this.dynemicDisplayPrice += (parseFloat(data));
            }
        }
        this.final_price = (parseFloat(this.bundlePrice));
        this.display_price = (this.dynemicDisplayPrice);
    }

    customData(customData) {
        this.customPrice = parseFloat(this.bundlePrice);
        this.customDisplayPrice = this.refDisplayPrice;
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
        this.customPrice += (parseFloat(customData.dynemicPrice));
        this.customDisplayPrice += (parseFloat(customData.dynemicPrice));
        this.final_price = this.customPrice;
        this.display_price = this.customDisplayPrice;
        this.addToCartData.total = this.final_price;
        if (customData.disable == false) {
            this.ifCustomOption(customData, null);
        }
    }

    group(groupData) {
        let total = parseFloat(this.refPrice) + (parseFloat(groupData.total));
        this.add_cart = {};
        this.final_price = total;
        this.groupedData = groupData;
        this.disable = groupData.disable;
        if (groupData.disable == false) {
            this.addToCartData.subData = [];
            this.add_cart = merge(this.add_cart, this.addToCartData, groupData);
        }
    }
    addToCartService() {
        if (!this.cartSpin) {
            this.cartSpin = true;
            this._cartService.addCart(this.add_cart, this.editCartData).then((response: any) => {
                this.cartData = response;
                this.cartSpin = false;
                if (this.cartData.body != undefined) {
                    if (this.editCartData) {
                        this._toast.toast("Updated product instead  successfully", 3000, "top");
                    } else {
                        this._toast.toast("Product added to cart successfully", 3000, "top");
                    }
                    this._navCtrl.push(CartPage).then(() => {
                        // first we find the index of the current view controller:
                        const index = this.viewCtrl.index;
                        // then we remove it from the navigation stack
                        this._navCtrl.remove(index);
                    });
                }
                else {
                }
            }, (err) => {
                this.cartSpin = false;
            });
        }
    }
}