import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {ProductPage} from '../../pages/product/product';
import {WishListService} from '../../providers/wishList/wishList-service';
import {CartService} from './../../providers/cart-service/cart-service';
import {ToastService} from './../../providers/toast-service/toastService';
import {CartPage} from '../cart/cart';
import {CartFunction} from '../../model/cart/cartHandling';
import {DomSanitizer} from '@angular/platform-browser'

@Component({
    selector: 'wishList',
    templateUrl: 'wishList.html'
})
export class wishList {
    data: object;
    constructor(private sanitized: DomSanitizer, private _cartFunction: CartFunction, public loadingCtrl: LoadingController, private _toast: ToastService, private _cartService: CartService, public _wishListService: WishListService, public local: Storage, private _navParams: NavParams, public _nav: NavController) {}
    /** ionViewWillEnter    
    *    
    * function call for every view enter and get updated wishlist data    
    **/
    ionViewWillEnter() {
        this._wishListService.getWishList().then((data) => {
            this.data = data;
        })
    }

    transform(value) {
        return this.sanitized.bypassSecurityTrustHtml(value.data['short_description']);
    }
    /** deleteProductWishList    
    *    
    * function call to delete selected wistlist    
    **/
    deleteProductWishList(data) {
        this._wishListService.deleteProductWishList(data).then((data) => {
            this.data = data;
        })
    }
    /** editWishList    
    *    
    * function call for edit wishList    
    **/
    editWishList(data) {
        this._nav.push(ProductPage, {'id': data.data.sku, "editCartData": data, "wishlist": true});
    }
    /** addToCart    
    *    
    * function use to move item wishlist to cart    
    **/
    addToCart(data) {
        data['productid'] = data['productId'] || data['productid'] || data['product'] || data['data'].entity_id;
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        this._cartService.addCart(data, '', true).then((response: any) => {
            loading.dismiss();
            if (response.body['success']) {
                this._cartFunction.setCart(response.body['success_data']);
                this._toast.toast(data['name'] + "added to your shopping cart", 3000, "top");
                this._nav.push(CartPage);
            }
            else {
                this._nav.push(ProductPage, {
                    id: data.data.sku
                });
            }
        }, (err) => {
            loading.dismiss();
            this._nav.push(ProductPage, {
                id: data.data.sku
            });
        });
    }
    /** c_Shopping    
    *    
    * function use for move on root page    
    **/
    c_Shopping() {
        this._nav.popToRoot();
    }
}
