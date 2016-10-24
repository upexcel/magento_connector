import { Component, OnInit} from '@angular/core';
import { NavController, MenuController, PopoverController, NavParams, LoadingController} from 'ionic-angular';
import {PopoverPage} from './../../components/popover/popover';
import { ProductPage } from '../product/product';
import clone from 'lodash/clone';
import { CategoryProduct } from './../../modal/categoryProduct/categoryProduct';
import {CategoryProductDataType} from './../../modal/categoryProductConfig/categoryProductData';
@Component({
    templateUrl: 'categoryProduct.html'
})
export class CategoryProductPage implements OnInit {
    clickshow: boolean = false;
    products: any;
    product_id: any;
    title: any;
    limit: number = 10;
    page: number = 1;
    data: CategoryProductDataType = {
        data: {
            data: []
        }
    }
    constructor(private _categoryConfig: CategoryProduct, private _loadingCtrl: LoadingController, private _navCtrl: NavController, private _navParams: NavParams, private _menuCtrl: MenuController, private _popoverCtrl: PopoverController) {
        this.product_id = _navParams.get('id');
        this.title = _navParams.get('name');
        _menuCtrl.enable(true);
    }
    ngOnInit() {
        this.presentLoading();
        this.show_products(this.product_id, this.page, this.limit);
    }
    show_products(product_id: any, page: any, limit: any) {
        this.clickshow = true;
        let body = { "id": product_id, "page": page, "limit": limit };
        this._categoryConfig.getCategoryProductConfig(body).then((res) => {
            this.data.data = res;
        })
            .catch((err) => {
                console.log(err);
            });
    }
    doInfinite(infiniteScroll) {
        var prod_length = this.data.data.data.length;
        var limit = this.limit;
        if (prod_length % 2 == 0) {
            if (prod_length < limit) {
                infiniteScroll.complete();
            }
            else if (prod_length >= limit) {
                setTimeout(() => {
                    this.limit += 6;
                    this.show_products(this.product_id, this.page, this.limit);
                    infiniteScroll.complete();
                }, 2000);
            }
            else if (prod_length <= limit) {
                setTimeout(() => {
                    this.limit += 6;
                    this.show_products(this.product_id, this.page, this.limit);
                    infiniteScroll.complete();
                }, 2000);
            }
            else { }
        }
        else {
            infiniteScroll.complete();
        }
    }
    gotoProduct(product) {
        this._navCtrl.push(ProductPage, {
            id: product
        });
    }
    openMenu() {
        this._menuCtrl.open();
    }
    presentPopover(myEvent: any) {
        let popover = this._popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }
    presentLoading() {
        let loader = this._loadingCtrl.create({
            content: "Loading...",
            duration: 2000
        });
        loader.present();
    }
    doRefresh(refresher) {
        this.show_products(this.product_id, this.page, this.limit);
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
}
