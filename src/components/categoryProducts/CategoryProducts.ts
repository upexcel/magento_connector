import {Component, Input} from '@angular/core';
import {ProductPage} from '../../pages/product/product';
import {NavController} from 'ionic-angular';
import {Events} from 'ionic-angular';
import {ToastService} from './../../providers/toast-service/toastService';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {WishListService} from '../../providers/wishList/wishList-service';
import forEach from 'lodash/forEach';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'category-view',
    templateUrl: 'categoryProducts.html'
})
export class CategoryComponent {
    @Input() product: any;
    displayMode: any = "Portrait";
    click: boolean = false;
    constructor(private sanitized: DomSanitizer, public _wishListService: WishListService, private _appConfigService: AppDataConfigService, private _toast: ToastService, private _events: Events, private _navCtrl: NavController) {
        this._events.subscribe('view:created', (view) => {
            this.viewChange(view);
        });
        setTimeout(() => {
            this.bundlePrice();
        }, 100);
    }
    bundlePrice() {
        console.log("this.product",this.product)
        forEach(this.product, (value) => {
            if (value.data.type == "bundle") {
                if (value.data.special_price && value.data.special_price.length > 0) {
                    let maxRPrice = (value.data.maxBPrice * value.data.special_price) / 100;
                    let minRPrice = (value.data.minBPrice * value.data.special_price) / 100;
                    value.data['displayBundlePrice'] = `From <b>${value.data.currency_sign}${minRPrice}</b> <span class="fontColor">Regular Price ${value.data.currency_sign}${value.data['minBPrice']} </span><br/> To <b>${value.data.currency_sign}${maxRPrice}</b>  <span class="fontColor">Regular Price ${value.data.currency_sign}${value.data['maxBPrice']} </span>`
                } else {
                    value.data['displayBundlePrice'] = `From ${value.data.currency_sign}${value.data['minBPrice']} <br/> To  ${value.data.currency_sign}${value.data['maxBPrice']} `
                }
            }
        });
    }
    transformPrice(value) {
        return this.sanitized.bypassSecurityTrustHtml(value['displayBundlePrice']);
    }
    /** 
*    wishList
* function use for set WishList Data
**/
    wishList(feat_prod) {
        this._appConfigService.getUserData().then((userData: any) => {
            if (userData && userData.access_token != null) {
                this._wishListService.setWishListData(feat_prod, {"productId": feat_prod.data.entity_id});
                if (feat_prod.data.wishlist_item_id) {
                    feat_prod.data.wishlist_item_id = false;
                } else {
                    feat_prod.data.wishlist_item_id = true;
                }
            } else {
                this._toast.toast("Please login first", 3000);
            }
        });
    }
    /** 
*    viewChange
* function use  for toggle view(Landscape,Portrait)
**/
    viewChange(view) {
        if (view == "portrait") {
            this.displayMode = "Landscape";
        }
        else {
            this.displayMode = "Portrait";
        }
        //        else {
        //            window.addEventListener("orientationchange", (value) => {
        //                var mql = window.matchMedia("(orientation: portrait)");
        //                if (mql.matches) {
        //                    // Portrait orientation
        //                    this.displayMode = "Portrait";
        //                } else {
        //                    // Landscape orientation
        //                    this.displayMode = "Landscape";
        //                }
        //                $('.scroll-content').trigger('swipe');
        //            }, false);
        //        }
    }
    /** 
*    gotoProduct
* function use to move on ProductPage
**/
    gotoProduct(product) {
        this._navCtrl.push(ProductPage, {
            id: product
        });
    }
}
