import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {CartPage} from '../cart/cart';
import {NavController, NavParams, Events, ViewController} from 'ionic-angular';
import {ApiService} from './../../providers/api-service/api-service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NotifyMe} from '../../model/product/notify';
import {CartService} from './../../providers/cart-service/cart-service';
import {productDataType} from '../../model/product/productDataType';
import {Product} from '../../model/product/getProduct';
import {cartDataType} from './../product/cartDataType';
import {ToastService} from './../../providers/toast-service/toastService';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {TierPrice} from '../../model/product/checkTierPrice';
import {Storage} from '@ionic/storage';
import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import merge from 'lodash/merge';
//import {Transfer} from 'ionic-native';
import {WishListService} from '../../providers/wishList/wishList-service';
import {config} from './../../providers/config/config';
import {ModalController} from 'ionic-angular';
import {WishListModel} from './../../model/wishList/wishList';
import {SocialSharing} from '@ionic-native/social-sharing';
import {LoadingController} from 'ionic-angular';
import {CartFunction} from '../../model/cart/cartHandling';
import {DomSanitizer} from '@angular/platform-browser';
import {NgZone} from '@angular/core';
import {LoginPage} from './../login/login';
import {ProductReview} from '../../components/reviewProduct/ReviewProduct';
import {Content} from 'ionic-angular';
@Component({
    selector: 'product',
    templateUrl: 'product.html'
})
export class ProductPage implements OnInit, AfterViewInit {
    @ViewChild(ProductReview) review: ProductReview;
    @ViewChild(Content) content: Content;
    productData: productDataType;
    logform: FormGroup;
    cartData: cartDataType;
    selectshow: boolean = true;
    spin: boolean = true;
    selectedList: Array<any> = [];
    disable: boolean = true;
    images: string;
    final_price: number = 0;
    refPrice: any = 0;
    refDisplayPrice: number = 0;
    display_price: any = 0;
    special_price: any = 0;
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
    additionalInformationData: Array<any> = [];
    customDisable: boolean = false;
    //gather data for send in add cart servive
    sku: string;
    img: string;
    name: string;
    type: string;
    bundlePrice: any = 0;
    configPrice: Array<any> = [];
    addToCartData;
    customPrice: any;
    customDisplayPrice: any = 0;
    dynemicDisplayPrice: any = 0;
    display_special_price: number = 0;
    display_special_priceRef: number = 0;
    product_custom_option: any;
    config = true;
    product = "product";
    downlodeFormValidate = true;
    virtual = false;
    userData: any;
    groupedData: any;
    cartSpin: boolean = false;
    customOptData;
    diffProductData;
    editCartData: any;
    cartButtonTitle: string;
    add_cart: object = {};
    mySlideOptions = config.productSliderOptions;
    quote_id: string;
    item_id: string;
    editProductQuantity: number;
    reviewLoader: boolean = true;
    message: boolean = false;
    relatedData = {"status": 1, "body": [{"data": {"wishlist_item_id": false, "entity_id": "1", "rating": "2.80", "qty": 84, "name": "Skybags Neon-02 Backpack", "type": "simple", "sku": "24-MB01", "weight": null, "productUrl": "http://5.9.144.226:9000/magento2/2.1.2/web/index.php/joust-duffle-bag.html", "price": "34.0000", "display_price": "34.00", "small_image": "http://5.9.144.226:9000/magento2/2.1.2/web/pub/media/catalog/product//n/e/neon02blk-skybags-backpack-neon-02-original-imadu8yjepy5ysxv.jpeg", "minify_image": "http://5.9.144.226:9000/magento2/2.1.2/web/pub/media/catalog/product//n/e/neon02blk-skybags-backpack-neon-02-original-imadu8yjepy5ysxv.jpeg", "special_from_date": "2017-09-13 00:00:00", "special_to_date": null, "currency_sign": "$", "special_price": "12.00", "display_special_price": "12.00", "tier_price": [{"price_id": "5", "website_id": "0", "all_groups": "1", "cust_group": 32000, "price": "5.0000", "price_qty": "5.0000", "website_price": "5.0000"}], "final_price": "12.00", "short_description": null, "long_description": "<p>The sporty Joust Duffle Bag can't be beat - not in the gym, not on the luggage carousel, not anywhere. Big enough to haul a basketball or soccer ball and some sneakers with plenty of room to spare, it's ideal for athletes with places to go.</p>\r\n<ul>\r\n<li>Dual top handles.</li>\r\n<li>Adjustable shoulder strap.</li>\r\n<li>Full-length zipper.</li>\r\n<li>L 29\" x W 13\" x H 11\".</li>\r\n</ul>", "media_images": ["http://5.9.144.226:9000/magento2/2.1.2/web/pub/media/catalog/product//n/e/neon02blk-skybags-backpack-neon-02-original-imadu8yjepy5ysxv.jpeg"], "additional_information": [], "in_stock": "In Stock"}}, {"data": {"wishlist_item_id": false, "entity_id": "50", "rating": "2.80", "qty": null, "name": "Luma Yoga For Life", "type": "downloadable", "sku": "240-LV09", "weight": null, "productUrl": "http://5.9.144.226:9000/magento2/2.1.2/web/index.php/luma-yoga-for-life.html", "price": "0.0000", "display_price": "0.00", "small_image": "http://5.9.144.226:9000/magento2/2.1.2/web/pub/media/catalog/product//l/t/lt06.jpg", "minify_image": "http://5.9.144.226:9000/magento2/2.1.2/web/pub/media/catalog/product//l/t/lt06.jpg", "special_from_date": "2017-09-07 00:00:00", "special_to_date": null, "currency_sign": "$", "special_price": "0.00", "display_special_price": "0.00", "tier_price": [], "final_price": "0.00", "short_description": "<p>Luma founder Erin Renny on yoga and longevity: \"I won't promise you'll live longer with yoga. No one can promise that. But your life will be healthier, less stressful, and more physically in tune when you focus on connecting your mind and body or a regular basis. Yoga is my favorite way to express this connection. I want to share the secrets of lifelong yoga with anyone willing to breathe and learn with me.\"</p>", "long_description": "<ul>\r\n<li>Increase strength + flexibility + metabolism</li>\r\n<li>Burn calories + feel great</li>\r\n<li>Gain energy + youthfulness + mental wellness</li>\r\n</ul>\r\n<h3 style=\"margin-top: 30px;\">Download description</h3>\r\n<p><strong style=\"display: block; margin: 20px 0 5px;\">Tone up mind and body</strong>Pro Yoga Instructor and Master Practitioner Marie Peale helps tone and sculpt your physique with her invigorating yet gentle approach.</p>\r\n<p>You'll learn to use yoga to relax, control stress and increase your calorie-burning capacity, all while exploring traditional and new yoga poses that lengthen and strengthen your full muscular structure.</p>\r\n<ul>\r\n<li>Easy download</li>\r\n<li>Audio options: Music and instruction or instruction only</li>\r\n<li>Heart rate techniques explained</li>\r\n<li>Breathing techniques explained</li>\r\n<li>Move through exercises at your own pace</li>\r\n</ul>\r\n<p>Two 25-minute workout episodes and one 40-minute workout episode with warm-up and cool down:</p>\r\n<p><strong style=\"display: block; margin: 20px 0 5px;\">Episode 1</strong>Creative, fun session geared toward opening your lungs. Combines stretching and breathing with a focus on hips and shoulders.</p>\r\n<p><strong style=\"display: block; margin: 20px 0 5px;\">Episode 2</strong>Ramp up the tempo and energy with calorie-burning flows. A stimulating workout introducing the body-sculpting power of yoga.</p>\r\n<p><strong style=\"display: block; margin: 20px 0 5px;\">Episode 3</strong>Push your fitness reach and stamina with an intense series of standing and floor exercises and poses. End this extra-length session with a meditative cool down.</p>\r\n<h3 style=\"margin-top: 30px;\">instructor bio</h3>\r\n<p><strong style=\"display: block; margin: 20px 0 5px;\">About Marie</strong>Marie is a trained martial artist and dancer with a BS in Biological Engineering and over 10 years as a certified yoga teacher. Marie has studied yoga in England, India and, in 2009, at the Ashraqat Ashram Yoga Farm in the United States. She has been teaching full time since then. Her focus on strength and wellness combines a deep knowledge of human biology and motivation guided by unconditional love for her audience.</p>", "media_images": ["http://5.9.144.226:9000/magento2/2.1.2/web/pub/media/catalog/product//l/t/lt06.jpg"], "additional_information": [], "in_stock": "In Stock"}, "samples": {}, "links": {"1": {"link_id": "7", "number_of_downloads": "0", "is_shareable": "2", "link_url": null, "link_file": "/l/u/luma_background_-_model_against_fence_4_sec_.mp4", "link_type": null, "sample_url": null, "sample_file": null, "sample_type": null, "title": "Episode 2", "price": "9.0000", "sample_file_downaload": "http://5.9.144.226:9000/magento2/2.1.2/web/index.php/downloadable/download/linkSample/link_id/7"}, "2": {"link_id": "8", "number_of_downloads": "0", "is_shareable": "2", "link_url": null, "link_file": "/l/u/luma_background_-_model_against_fence_4_sec_.mp4", "link_type": null, "sample_url": null, "sample_file": null, "sample_type": null, "title": "Episode 3", "price": "9.0000", "sample_file_downaload": "http://5.9.144.226:9000/magento2/2.1.2/web/index.php/downloadable/download/linkSample/link_id/8"}, "3": {"link_id": "6", "number_of_downloads": "0", "is_shareable": "2", "link_url": null, "link_file": "/l/u/luma_background_-_model_against_fence_4_sec_.mp4", "link_type": null, "sample_url": null, "sample_file": null, "sample_type": null, "title": "Episode 1", "price": "9.0000", "sample_file_downaload": "http://5.9.144.226:9000/magento2/2.1.2/web/index.php/downloadable/download/linkSample/link_id/6"}}}, {"data": {"wishlist_item_id": false, "entity_id": "51", "rating": "2.80", "qty": 0, "name": "Sprite Yoga Companion Kit", "type": "bundle", "sku": "24-WG080", "weight": null, "productUrl": "http://5.9.144.226:9000/magento2/2.1.2/web/index.php/sprite-yoga-companion-kit.html", "price": 0, "display_price": "0.00", "small_image": "http://5.9.144.226:9000/magento2/2.1.2/web/pub/media/catalog/product//l/u/luma-yoga-kit-2.jpg", "minify_image": "http://5.9.144.226:9000/magento2/2.1.2/web/pub/media/catalog/product//l/u/luma-yoga-kit-2.jpg", "special_from_date": "2017-09-27 00:00:00", "special_to_date": null, "currency_sign": "$", "special_price": "5.00", "minBPrice": 287, "maxBPrice": 344, "display_special_price": "5.00", "tier_price": [], "final_price": "0.00", "short_description": null, "long_description": "<p>A well-rounded yoga workout takes more than a mat. The Sprite Yoga Companion Kit helps stock your studio with the basics you need for a full-range workout. The kit is composed of four best-selling Luma Sprite accessories in one easy bundle: statis ball, foam block, yoga strap, and foam roller. Choose sizes and colors and leave the rest to us. The kit includes:</p>\r\n<ul>\r\n<li>Sprite Statis Ball</li>\r\n<li>Sprite Foam Yoga Brick</li>\r\n<li>Sprite Yoga Strap</li>\r\n<li>Sprite Foam Roller</li>\r\n</ul>", "media_images": ["http://5.9.144.226:9000/magento2/2.1.2/web/pub/media/catalog/product//l/u/luma-yoga-kit-2.jpg"], "additional_information": [], "in_stock": "In Stock"}, "bundle_items": [{"type": "radio", "title": "Sprite Stasis Ball", "is_require": "1", "selection": [{"selection_id": "179", "selection_name": "Sprite Stasis Ball 65 cm", "selection_product_id": "352", "selection_qty": "1.0000", "selection_price": "27.0000", "is_default": "1"}, {"selection_id": "179", "selection_name": "Sprite Stasis Ball 75 cm", "selection_product_id": "353", "selection_qty": "1.0000", "selection_price": "32.0000", "is_default": "0"}]}, {"type": "radio", "title": "Sprite Foam Yoga Brick", "is_require": "1", "selection": [{"selection_id": "180", "selection_name": "Sprite Foam Yoga Brick", "selection_product_id": "354", "selection_qty": "1.0000", "selection_price": "5.0000", "is_default": "1"}]}, {"type": "radio", "title": "Sprite Yoga Strap", "is_require": "1", "selection": [{"selection_id": "181", "selection_name": "Sprite Yoga Strap 6 foot", "selection_product_id": "355", "selection_qty": "6.0000", "selection_price": "14.0000", "is_default": "0"}, {"selection_id": "181", "selection_name": "Sprite Yoga Strap 8 foot", "selection_product_id": "356", "selection_qty": "8.0000", "selection_price": "17.0000", "is_default": "1"}, {"selection_id": "181", "selection_name": "Sprite Yoga Strap 10 foot", "selection_product_id": "357", "selection_qty": "6.0000", "selection_price": "21.0000", "is_default": "0"}]}, {"type": "radio", "title": "Sprite Foam Roller", "is_require": "1", "selection": [{"selection_id": "182", "selection_name": "Sprite Foam Roller", "selection_product_id": "358", "selection_qty": "9.0000", "selection_price": "19.0000", "is_default": "1"}]}]}, {"data": {"wishlist_item_id": false, "entity_id": "2053", "rating": "2.80", "qty": 0, "name": " Yoga Companion kit", "type": "bundle", "sku": " Yoga Companion kit", "weight": null, "productUrl": "http://5.9.144.226:9000/magento2/2.1.2/web/index.php/test-yoga-companion-kit.html", "price": 0, "display_price": "0.00", "small_image": "http://5.9.144.226:9000/magento2/2.1.2/web/pub/media/catalog/product//n/a/na-credence-c-ym-ar-original-imaen796zgtgvf9h_1.jpeg", "minify_image": "http://5.9.144.226:9000/magento2/2.1.2/web/pub/media/catalog/product//n/a/na-credence-c-ym-ar-original-imaen796zgtgvf9h_1.jpeg", "special_from_date": "2017-09-27 00:00:00", "special_to_date": null, "currency_sign": "$", "special_price": "0.00", "minBPrice": 14.35, "maxBPrice": 17.2, "display_special_price": "0.00", "tier_price": [], "final_price": "0.00", "short_description": null, "long_description": "<p><br /><span>Perform your workouts with ease with the help of this perfect gym kit brought to you by Credence Creation. The brand has designed these excellent exercise accessories with immense precision and technique. The fitness kit includes a number of accessories such as one pair of push up bars, skipping rope, and Power Hand Grip in the pack. Made of premium quality material, these accessories are very convenient in use and quite long lasting in nature as well. So, bring this excellent item home today.</span></p>", "media_images": ["http://5.9.144.226:9000/magento2/2.1.2/web/pub/media/catalog/product//n/a/na-credence-c-ym-ar-original-imaen796zgtgvf9h_1.jpeg"], "additional_information": [], "in_stock": "In Stock"}, "bundle_items": [{"type": "radio", "title": "Sprite Stasis Ball", "is_require": "1", "selection": [{"selection_id": "193", "selection_name": "Pursuit Lumaflex&trade; Tone Band", "selection_product_id": "371", "selection_qty": "1.0000", "selection_price": "16.0000", "is_default": "1"}]}, {"type": "radio", "title": "Sprite Foam Yoga Brick", "is_require": "1", "selection": [{"selection_id": "194", "selection_name": "Sprite Foam Yoga Brick", "selection_product_id": "372", "selection_qty": "1.0000", "selection_price": "5.0000", "is_default": "1"}]}]}, {"data": {"wishlist_item_id": false, "entity_id": "2055", "rating": "2.80", "qty": 999, "name": " Vibe K5 Note", "type": "simple", "sku": " Vibe K5 Note", "weight": null, "productUrl": "http://5.9.144.226:9000/magento2/2.1.2/web/index.php/vibe-k5-note.html", "price": "200.0000", "display_price": "200.00", "small_image": "http://5.9.144.226:9000/magento2/2.1.2/web/pub/media/catalog/product//l/e/lenovo-vibe-k5-note-pa330116in-pa330114in-original-imaepc2fus3cxhgu.jpeg", "minify_image": "http://5.9.144.226:9000/magento2/2.1.2/web/pub/media/catalog/product//l/e/lenovo-vibe-k5-note-pa330116in-pa330114in-original-imaepc2fus3cxhgu.jpeg", "special_from_date": "2017-09-27 00:00:00", "special_to_date": null, "currency_sign": "$", "special_price": "0.00", "display_special_price": "0.00", "tier_price": [], "final_price": "200.00", "short_description": "<p><span>Metal rules and Lenovo definitely knows that. The Vibe K5 Note comes with a gorgeous metal body that looks and feels great. You also get two equally beautiful colour variants to choose from.</span></p>", "long_description": "<ul class=\"_3eXgaQ\">\r\n<li class=\"_2D2_E1 TCz0TK\">4G Connectivity and Phone Features Depend on the Carrier and the Location of the User</li>\r\n<li class=\"_2D2_E1 TCz0TK\">The second SIM slot of this dual SIM phone accepts either a nano SIM card or a microSD Memory Card. If you are using 2 SIM cards, you will not be able to expand the phone's memory using a microSD Memory Card</li>\r\n</ul>", "media_images": ["http://5.9.144.226:9000/magento2/2.1.2/web/pub/media/catalog/product//l/e/lenovo-vibe-k5-note-pa330116in-pa330114in-original-imaepc2fus3cxhgu.jpeg"], "additional_information": [], "in_stock": "In Stock", "product_custom_option": [{"title": "size", "type": "radio", "is_require": "1", "option_type": [{"default_title": "35", "default_price": "20.0000", "price": "20.0000", "sku": " Vibe K5 Note", "option_type_id": "1", "option_id": "1", "price_type": "fixed"}, {"default_title": "36", "default_price": "20.0000", "price": "20.0000", "sku": " Vibe K5 Note", "option_type_id": "2", "option_id": "1", "price_type": "fixed"}]}]}}]};
    constructor(private _ngZone: NgZone, private sanitized: DomSanitizer, private _cartFunction: CartFunction, public loadingCtrl: LoadingController, public _socialSharing: SocialSharing, public _wishList: WishListModel, public _modalCtrl: ModalController, public _wishListService: WishListService, private viewCtrl: ViewController, private _tierPrice: TierPrice, private _notifyService: NotifyMe, private emailTest: FormBuilder, private _appConfigService: AppDataConfigService, private _toast: ToastService, public _events: Events, public _getProduct: Product, private _local: Storage, private _cartService: CartService, private _navCtrl: NavController, private _navParams: NavParams, private _apiService: ApiService) {
        this.logform = this.emailTest.group({email: ['', Validators.required]});
    }
    ngOnInit() {
        this._appConfigService.getUserData().then((userData: any) => { //get user data
            if (userData) {
                this.userEmail = userData.email; //get user email
            } else {
                this.userEmail = '';    //if not set blank string 
            }
            this.userData = userData;//make it globle
            this.id = this._navParams.get('id');//get id
            this.editCartData = this._navParams.get('editCartData');    //data come for edit
            this.quote_id = this._navParams.get('quote_id');
            this.editProductQuantity = this._navParams.get('editProductQuantity');    //hold quantity of editable item
            this.item_id = this._navParams.get('item_id');    //hold item id
            if (this.editCartData && !this._navParams.get('wishlist')) {    //inset title name
                this.cartButtonTitle = 'UPDATE CART';
            } else {
                this.cartButtonTitle = 'ADD TO CART';
            }
            // call products function when it lode first time
            this.products();
            //calll when any review is added 
            this._events.subscribe('api:review', (review) => {
                // this.products();
                this.reviewLoader = false;
                setTimeout(() => {
                    this.reviewLoader = true;
                });
            });
        })
    }
    ngAfterViewInit() {

    }
    trackmyImageFn(index, data) {
        return index;
    }
    trackmykeyFn(index, keydata) {
        return keydata;
    }
    trackmyAssociated_productsFn(index, associateddata) {
        return associateddata.id;
    }
    trackmy_add_to_cart(index, data) {
        return index;
    }
    trackmy_additionalInformationData(index, data) {
        return index;
    }
    addReview() {
        this.review.addReview();
    }
    ngOnDestroy() {
        this._events.unsubscribe('api:review');
    }
    doRefresh(refresher) {
        this._ngZone.run(() => {
            this.type = null;
            this.productData = null;
            this.spin = true;
            this._appConfigService.resetDataInService();    //clear data service (clear local hold data)
            this.products().then((res) => {
                if (res) {
                    this.selectshow = true;
                    refresher.complete();    //complete refresher
                }
            })
        })
    }
    transform(value) {
        return this.sanitized.bypassSecurityTrustHtml(value.body.data['long_description']);
    }
    transformPrice(value) {
        return this.sanitized.bypassSecurityTrustHtml(value['displayBundlePrice']);
    }
    relatedProductItemClick(data) {
        this.data = {
            "sku": data.body.data.sku
        };
        this.reviewLoader = false;
        setTimeout(() => {
            this.reviewLoader = true;
        });
        this.setValue(data);
    }
    /*
     * function use for share options
     */
    shareWithOptions(caption, img, productUrl) {
        let opt = {
            message: '',
            subject: caption,
            files: img,
            url: productUrl,
            chooserTitle: 'Pick an app'
        }
        this._socialSharing.shareWithOptions(opt)        //call shareWithOptions service 
            .then(() => console.log('Shared!'))
            .catch((error: any) => console.error(error));
        let loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 4000
        });
        loader.present();
    }
    /*
     * use to set product in wishlist
     */
    wishList(feat_prod) {
        let data = {};
        data["productId"] = feat_prod.data.entity_id;
        if (Object.keys(this.add_cart).length > 0) {
            if (this.type != "grouped") {
                data["qty"] = 1;
                if (this.type == 'configurable' && Object.keys(this.add_cart['super_attribute'])) {
                    data["super_attribute"] = this.add_cart['super_attribute'];
                } else if (this.type == "downloadable" && Object.keys(this.add_cart['links'])) {
                    data["links"] = this.add_cart['links'];
                }
                else if (this.type == "bundle" && Object.keys(this.add_cart['bundle_option_qty'])) {
                    data["bundle_option_qty"] = this.add_cart['bundle_option_qty'];
                    data["bundle_option"] = this.add_cart['bundle_option'];
                }
            } else {
                data["qty"] = 0;
                if (Object.keys(this.add_cart['super_attribute'])) {
                    data["super_group"] = this.add_cart['super_attribute'];
                }
            }
            if (this.add_cart['options'] && Object.keys(this.add_cart['options']).length > 0) {
                data["options"] = this.add_cart['options'];
            }
        }
        feat_prod = merge(feat_prod, this.add_cart);
        this._appConfigService.getUserData().then((userData: any) => {
            if (userData && userData.access_token != null) {
                if (feat_prod.data.wishlist_item_id) {
                    feat_prod.data.wishlist_item_id = false;
                } else {
                    feat_prod.data.wishlist_item_id = true;
                }
                this._wishListService.setWishListData(feat_prod, data);
            } else {
                this._toast.toast("Please login first", 3000);
            }
        });

    }
    /*
     * this function is use for get product data a
     */
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
        return new Promise((resolve, reject) => {
            this._getProduct.getProduct(this.data).then((res: any) => {
                resolve(res);
                this.setValue(res);

            }, (err) => {
                this._toast.toast("Please Refresh This Page !!", 3000, "bottom");
                this.error = true;
                this.spin = false;
            });
        });
    }


    setValue(res) {
        if (res && res.body.data) {
            this.message = false;
            this.spin = false;
            this.productData = res;
            this.error = false;
            //                    this.product = this.productData.body.data.name;//product name
            this.productid = this.productData.body.data.entity_id;//entity id
            this.images = this.productData.body.data.media_images[0];//first image
            this.special_price = this.productData.body.data.special_price;//special price
            this.display_price = this.productData.body.data.display_price;//display price
            this.final_price = this.productData.body.data.final_price;//final price
            this.display_special_price = this.productData.body.data.display_special_price;
            this.display_special_priceRef = this.productData.body.data.display_special_price;
            this.refPrice = this.productData.body.data.final_price;//final price refirence variable
            this.refDisplayPrice = this.productData.body.data.display_price;//display price refirence variable
            this.bundlePrice = parseFloat(this.refPrice);//parse final price refirence variable
            this.dynemicDisplayPrice = this.refDisplayPrice;//display price refirence variable
            //gather data for send in add cart servive
            this.sku = this.productData.body.data.sku;//sku id
            this.img = this.productData.body.data.media_images[0];//first image
            this.name = this.productData.body.data.name;//product name
            this.type = this.productData.body.data.type;//product type
            let additionalInformation = this.productData.body.data.additional_information;//additional_information if exist
            this.product_custom_option = this.productData.body.data.product_custom_option;//product_custom_option if exist
            //create comman data use in cart/cart api
            this.addToCartData = {productid: this.productData.body.data.entity_id, sku: this.sku, "currency_sign": this.productData.body.data.currency_sign, img: this.img, name: this.name, total: this.final_price, tier_price: this.tier_price, type: this.type, quantity: 1, qty: 1, "access_token": this.userData ? this.userData.access_token : "", "quote_id": this.quote_id, "item_id": this.item_id};
            //get additional_information if exit
            if (this.type == "bundle") {
                if (this.special_price && this.special_price.length > 0) {
                    let maxRPrice = (this.productData.body.data.maxBPrice * this.special_price) / 100;
                    let minRPrice = (this.productData.body.data.minBPrice * this.special_price) / 100;
                    this.productData.body.data['displayBundlePrice'] = `<span style="padding-bottom:10px;"> From <b>${this.productData.body.data.currency_sign}${minRPrice}</b> <span class="fontColor">Regular Price ${this.productData.body.data.currency_sign}${this.productData.body.data['minBPrice']} </span> </span><br/> To <b>${this.productData.body.data.currency_sign}${maxRPrice} </b> <span class="fontColor">Regular Price ${this.productData.body.data.currency_sign}${this.productData.body.data['maxBPrice']} </span>`
                } else {
                    this.productData.body.data['displayBundlePrice'] = `From ${this.productData.body.data.currency_sign}${this.productData.body.data['minBPrice']}  <br/> To  ${this.productData.body.data.currency_sign}${this.productData.body.data['maxBPrice']} `
                }
            }
            if (additionalInformation != undefined) {
                forEach(additionalInformation, (value, key) => {
                    if (value != false) {
                        this.additionalInformationData.push({ //create data to itterable formate in html
                            "key": key,
                            "value": value
                        });
                    }
                })

            }
            if (this.productData.body.associated_products) {
                this.keys = keys(this.productData.body.associated_products.attributes);
                if (this.keys.length == 0) {
                    this.disable = true;    //button  disable
                }
            }
            //add a vertual key
            if (this.editCartData) { //if data come for edit
                //check type of product
                if (this.editCartData.type != "configurable" && this.editCartData.type != "bundle" && this.editCartData.type != "downloadable") {
                    //button not disable
                    this.disable = false;
                    //comman data merge with add_cart
                    this.add_cart = merge(this.add_cart, this.addToCartData);
                }
                if (this.productData.body.associated_products) { //if associated_products exist
                    if (Object.keys(this.productData.body.associated_products.attributes).length > 0) {
                        //set data  in product page for edit 
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
                }
            } else {
                if (this.productData.body.associated_products) {
                    if (Object.keys(this.productData.body.associated_products.attributes).length > 0) {
                        forEach(this.productData.body.associated_products.attributes, (attributesData) => {
                            attributesData.vertualKey = false;//set vertualKey as false in associated_products attributes
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
        else if (res.body.length == 0) {
            this.spin = false;
            this.message = true;
        }
    }
    /*
     *function call when any change occurs in select list.it has configurableSelectedObject hold item object and key
     */
    onChangeConfigurableAttribute(configurableSelectedObject, key) {
        if (!configurableSelectedObject) {
            return;
        }
        let count = 0;
        var total = 0;
        var flag = 0;
        this.configPrice = [];
        this.selectedList = [];
        //mapping between select list
        forEach(this.productData.body.associated_products.attributes, (allConfigData, allConfigKey) => {
            if (typeof (allConfigData.vertualKey) == 'object') {
                ++flag;
                count++;
                this.configPrice.push({price: allConfigData.vertualKey.price}); //hold  price of selected item
                this.selectedList.push(allConfigData);
                if (allConfigData.label == "color") {
                    setTimeout(() => {
                        let myDiv = document.getElementById('color');//change icon color of configurable callor filed
                        myDiv.style.color = ((allConfigData.vertualKey.label).trim()).replace(" ", "") || ""; //remove space from lable
                    }, 100)
                }
            }
            if (key != allConfigKey) {    //check all select list is selected or not
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
        forEach(this.configPrice, (value: any) => {        //total price come form configurable product when you select the list
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

    userUpdated(event: any) {
        this.reviewData = event;
    }
    public askEmail: boolean;
    /*
     * this function is used to set notification for product stock
     */
    notifySet() {
        if (this.userEmail) {
            this.alertSetApi(this.userEmail)
        } else {
            this._toast.toast("Please Login First !!", 3000, "bottom");
        }
    }
    /*
     * use to set notification
     */
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
    /*
     * function use for creating data for api use 
     */
    configurabilData() {
        let array: any = {};
        this.add_cart = {};
        let selectedItem: string;
        if (this.type == "configurable") {
            forEach(this.selectedList, (listdata) => {
                array[listdata.id] = listdata.vertualKey.id;
            });
            selectedItem = (array);
            let cartApiData = {"productid": this.productid, "qty": this.qty, "super_attribute": selectedItem, "total": this.final_price};
            this.add_cart = merge(this.add_cart, this.addToCartData, cartApiData);
            this.ifCustomOption("", this.add_cart)
        }
    }
    /*
     * simple+vertual+downloadble 
     * customOpt have customOption if exist and diffProduct have other data
     */
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
        this.display_special_price = this.display_special_priceRef;
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
            this.bundlePrice = (parseFloat(this.bundlePrice)) + (parseFloat(data.dynemicPrice));

            this.dynemicDisplayPrice += (parseFloat(data.dynemicPrice));
            this.display_special_price += (parseFloat(data.dynemicPrice));

        }
        else if (this.type == 'bundle') {
            this.disable = data.disable;
            this.bundlePrice = (parseFloat(this.bundlePrice)) + (parseFloat(data.total));
            this.dynemicDisplayPrice += (parseFloat(data.total));
            this.display_special_price = 0;
            if (data.disable == false) {
                this.ifCustomOption(null, data);
            }
        }
        else {
            if (data >= 0) {
                this.bundlePrice = (parseFloat(this.refPrice)) + (parseFloat(data));
                this.dynemicDisplayPrice = parseFloat(this.dynemicDisplayPrice) + (parseFloat(data));
                this.display_special_price = (this.display_special_price * 1) + (parseFloat(data));
            }
        }
        this.final_price = (parseFloat(this.bundlePrice));
        this.display_price = (parseFloat(this.dynemicDisplayPrice));
    }

    customData(customData) {   //function handle customData and its validation
        this.customPrice = parseFloat(this.bundlePrice);
        this.customDisplayPrice = this.refDisplayPrice;
        this.customDisable = customData.disable;
        if (this.type == 'configurable') {//check product type
            if (this.config == false && customData.disable == false) {
                this.disable = false;//validation
            }
            else {
                this.disable = true;//button disable
            }
        } else if (this.type == 'downloadable') {
            if (this.downlodeFormValidate == false && customData.disable == false) {
                this.disable = false;//validation
            }
            else {
                this.disable = true;//validation
            }
        } else if (this.type == 'virtual') {
            this.disable = customData.disable;//validation
        }
        else if (this.type == 'simple') {
            this.disable = customData.disable; //validation
        }
        else {
            this.disable = true;//validation
        }//handle price custom option
        this.customPrice += (parseFloat(customData.dynemicPrice));
        this.customDisplayPrice = (parseFloat(this.customDisplayPrice)) + (parseFloat(customData.dynemicPrice));
        this.final_price = (parseFloat(this.customPrice));
        this.display_price = (parseFloat(this.customDisplayPrice));
        this.addToCartData.total = this.final_price;
        if (customData.disable == false) {
            this.ifCustomOption(customData, null);//map with other data selection
        }
    }
    /*
     * function use for group product
     */
    group(groupData) {
        let total = parseFloat(this.refPrice) + (parseFloat(groupData.total));
        this.add_cart = {};
        this.final_price = total;
        this.groupedData = groupData;
        this.disable = groupData.disable;//grop data validate
        if (groupData.disable == false) {
            this.addToCartData.subData = [];
            this.add_cart = merge(this.add_cart, this.addToCartData, groupData);
        }
    }
    /*
     * function use for add to cart and edit cart data
     */
    addToCartService() {
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        if (!this.cartSpin) {
            loading.present();
            this.cartSpin = true;
            if (this.cartButtonTitle != 'UPDATE CART') {
                if (this.addToCartData && this.addToCartData.access_token) {
                    this._cartService.addCart(this.add_cart, this.editCartData).then((response: any) => {//call service fire api for cart add
                        this.cartData = response;
                        this.cartSpin = false;
                        loading.dismiss();
                        if (this.cartData.body['success']) {
                            loading.dismiss();
                            this._cartFunction.setCart(response.body['success_data']);//set data
                            this._toast.toast(this.product + " added to your shopping cart", 3000, "top");
                            this._navCtrl.push(CartPage).then(() => {    //move to CartPage
                                const index = this.viewCtrl.index;
                                this._navCtrl.remove(index); //remove product page
                            });
                        }
                        else {
                            loading.dismiss();
                        }
                    }, (err) => {
                        loading.dismiss();
                        this.cartSpin = false;
                    });

                } else {
                    loading.dismiss();
                    this.cartSpin = false;
                    let res = {};
                    res["add_cart"] = this.add_cart;
                    res["editCartData"] = this.editCartData;
                    res['ProductName'] = this.product;
                    this._toast.toast("Please Login First !!", 3000);
                    this._navCtrl.push(LoginPage, {checkoutLogin: true, res: res});
                }
            } else {
                this.add_cart['qty'] = this.editProductQuantity;
                this.add_cart['quantity'] = this.editProductQuantity;
                this._cartFunction.editCart(this.add_cart).then((res) => {//call service fire api for cart edit
                    this.cartData = res;
                    this.cartSpin = false;
                    loading.dismiss();
                    if (this.cartData.body['success_data']) {
                        this._cartFunction.setCart(res.body['success_data']);//set data
                        this._toast.toast(this.product + " updated to your shopping cart", 3000, "top");
                        this._navCtrl.push(CartPage).then(() => {//move to CartPage
                            this._navCtrl.remove(this._navCtrl.getPrevious(this.viewCtrl).index, 2).then(() => {
                            });
                        });
                    }
                }, (err) => {
                    loading.dismiss();
                    this.cartSpin = false;
                });
            }
        }
    }
}