import { Component, OnInit} from '@angular/core';
import { NavController, MenuController, PopoverController, NavParams, LoadingController} from 'ionic-angular';
import {ApiService } from './../../providers/api-service/api-service';
import { Data } from './../../components/data/data';
import {PopoverPage} from './../../components/popover/popover';
import { ProductPage } from '../product/product';
import clone from 'lodash/clone';
@Component({
    templateUrl: 'categoryProduct.html'
})
export class CategoryProduct implements OnInit {
    lists: any;
    public data: Data[];
    showList: boolean = false;
    clickshow: boolean = false;
    products: any;
    product_id: any;
    spin: boolean;
    title: any;
    limit: number = 10;
    page: number = 1;
    pro: any;
    constructor(private _loadingCtrl: LoadingController, private _navCtrl: NavController, private _navParams: NavParams, private _menuCtrl: MenuController, private _popoverCtrl: PopoverController, private _apiService: ApiService) {
        this.product_id = _navParams.get('id');
        this.title = _navParams.get('name');
        _menuCtrl.enable(true);
    }
    ngOnInit() {
        this.presentLoading();
        this.show_products(this.product_id, this.page, this.limit);
    }
    show_products(product_id: any, page: any, limit: any) {
        //        this.spin = true;
        this.clickshow = true;
        var path = { "id": product_id, "page": page, "limit": limit };
        this._apiService.api("category/products/", path).subscribe((res) => {
            var res_data = [];
            if (res) {
                this.pro = res.data;
                for (var product of this.pro) {
                    res_data.push(product);
                }
                this.products = clone(res_data);
            }
        });
    }
    doInfinite(infiniteScroll) {
        var prod_length = this.products.length;
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
