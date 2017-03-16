import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import forEach from 'lodash/forEach';
import { ProductPage } from '../../pages/product/product';

@Component({
    selector: 'wishList',
    templateUrl: 'wishList.html'
})
export class wishList {
    data: any;
    constructor(public local: Storage, private _navParams: NavParams, public _nav: NavController) {
        var list = this._navParams.get('data');
        this.local.get('wishList').then((res: any) => {
            var match = false;
            var response: any = [];
            if (res) {
                forEach(res, (value, key) => {
                    if (value.data.entity_id == list.data.entity_id) {
                        match = true;
                    }
                    response.push(value)
                })
                if (!match) {
                    response.push(list);
                    this.data = response;
                    this.local.set("wishList", this.data);
                } else {
                    this.data = res;
                }


            } else {
                this.data = [list];
                this.local.set("wishList", this.data);
            }
        })

    }
    deleteProductWishList(data) {
        console.log(data);
        this.local.get('wishList').then((res: any) => {
            forEach(res, (value, key) => {
                console.log(value)
                if (value && value.data.entity_id == data.data.entity_id) {
                    res.splice(key, 1);
                    this.data = res;
                    this.local.set("wishList", res);
                }
            })
        });
    }
    editWishList(data) {
        this._nav.push(ProductPage, {
            id: data.data.sku
        });
    }
    addToCart(data) {
        this._nav.push(ProductPage, {
            id: data.data.sku
        });
    }
}
