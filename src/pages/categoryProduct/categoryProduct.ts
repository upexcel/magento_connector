import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, PopoverController, NavParams, ViewController, LoadingController, Events } from 'ionic-angular';
import { PopoverPage } from './../../components/popover/popover';
import { CategoryProduct } from './../../model/categoryProduct/categoryProduct';
import { CategoryProductDataType } from './../../model/categoryProduct/categoryProductData';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';
import { GenericAnalytics } from './../../providers/genericAnalytics/genericAnalytics';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
@Component({
    templateUrl: 'categoryProduct.html'
})
export class CategoryProductPage implements OnInit {
    products: any;
    product_id: any;
    title: string;
    limit: number = 10;
    page: number = 1;
    categoryProduct: CategoryProductDataType;
    access_token: string;
    showPopOver: boolean = false;
    error: boolean = false;
    constructor(public _genericAnalytic: GenericAnalytics, private _viewCtrl: ViewController, private _appConfigService: AppDataConfigService, private _events: Events, private _local: Storage, private _category: CategoryProduct, private _loadingCtrl: LoadingController, private _navCtrl: NavController, private _navParams: NavParams, private _menuCtrl: MenuController, private _popoverCtrl: PopoverController) {
        this.product_id = _navParams.get('id');
        this.title = _navParams.get('name');
        _menuCtrl.enable(true);
    }
    ionViewWillEnter() {
        this._genericAnalytic.setTrackView("categoryProduct Page");
    }
    ngOnInit() {
        console.log(this._viewCtrl)
        this.access_token = this._navParams.get("access_token");
        this._appConfigService.getUserData().then((userData: any) => {
            if (this.access_token != null || userData != null) {
                this.showPopOver = true;
            } else {
                this.showPopOver = false;
            }
        });
        this.show_products(this.product_id, this.page, this.limit);
    }
    ngOnDestroy() {
    }
    show_products(product_id: any, page: any, limit: any) {
        let body = { "id": product_id, "page": page, "limit": limit };
        this._category.getCategoryProduct(body).then((res) => {
            this.categoryProduct = res;
        })
            .catch((err) => {
                this.error = true;
            });
    }
    doInfinite(infiniteScroll) {
        var limit = this.limit;
        if (this.categoryProduct.body.length % 2 == 0) {
            if (this.categoryProduct.body.length < limit) {
                infiniteScroll.complete();
                infiniteScroll.enable(false);
            }
            else if (this.categoryProduct.body.length >= limit) {
                setTimeout(() => {
                    this.limit += 6;
                    this.show_products(this.product_id, this.page, this.limit);
                    infiniteScroll.complete();
                    infiniteScroll.enable(false);
                }, 100);
            }
            else if (this.categoryProduct.body.length <= limit) {
                setTimeout(() => {
                    this.limit += 6;
                    this.show_products(this.product_id, this.page, this.limit);
                    infiniteScroll.complete();
                    infiniteScroll.enable(false);
                }, 100);
            }
            else { }
        }
        else {
            infiniteScroll.complete();
            infiniteScroll.enable(false);
        }
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
    doRefresh(refresher) {
        this.show_products(this.product_id, this.page, this.limit);
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
    gotoLogin() {
        this._navCtrl.push(LoginPage);
    }
}
