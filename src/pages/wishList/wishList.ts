import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import forEach from 'lodash/forEach';
import { ProductPage } from '../../pages/product/product';
import { WishListService } from '../../providers/wishList/wishList-service';
import { HomePage } from './../home/home';

@Component({
    selector: 'wishList',
    templateUrl: 'wishList.html'
})
export class wishList {
    data: any;
    constructor(public _wishListService: WishListService, public local: Storage, private _navParams: NavParams, public _nav: NavController) {

        this._wishListService.getWishList().then((data) => {
            console.log("get", data);
            this.data = data;
        })
    }
    deleteProductWishList(data) {
        this._wishListService.deleteProductWishList(data).then((data) => {
            console.log("delete", data);
            this.data = data;
        })
    }
    editWishList(data) {
        this._nav.push(ProductPage, { 'id': data.data.sku, "editCartData": data, "wishlist":true });
    }
    addToCart(data) {
        this._nav.push(ProductPage, {
            id: data.data.sku
        });
    }
    c_Shopping() {
        this._nav.setRoot(HomePage);
    }
}
