import { Component, Input } from '@angular/core';
import { ProductPage } from '../../pages/product/product';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { ToastService } from './../../providers/toast-service/toastService';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';
import { WishListService } from '../../providers/wishList/wishList-service'
import forEach from 'lodash/forEach';
@Component({
    selector: 'category-view',
    templateUrl: 'categoryProducts.html'
})
export class CategoryComponent {
    @Input() product: any;
    displayMode: any = "Portrait";
    click: boolean = false;
    constructor(public _wishListService: WishListService, private _appConfigService: AppDataConfigService, private _toast: ToastService, private _events: Events, private _navCtrl: NavController) {
        this._events.subscribe('view:created', (view) => {
            this.viewChange(view);
        });
        forEach(this.product, (value) => {
            value.toggleWishList = false;
        })
    }
    wishList(feat_prod) {
        this._appConfigService.getUserData().then((userData: any) => {
            if (userData && userData.access_token != null) {
                this._wishListService.setWishListData(feat_prod, { "productId": feat_prod.data.entity_id, "secret": userData['secret'] });
                feat_prod.toggleWishList = !feat_prod.toggleWishList;
            } else {
                this._toast.toast("Please login first", 3000);
            }
        });
    }
    viewChange(view) {
        if (view == "portrait") {
            this.displayMode = "Landscape";
        }
        else {
            this.displayMode = "Portrait";
        }
        //        else {
        //            window.addEventListener("orientationchange", (value) => {
        //                console.log("value", value);
        //                var mql = window.matchMedia("(orientation: portrait)");
        //                console.log("match medea", mql)
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
    gotoProduct(product) {
        this._navCtrl.push(ProductPage, {
            id: product
        });
    }
}
