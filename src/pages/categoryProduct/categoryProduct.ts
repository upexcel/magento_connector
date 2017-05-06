import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, PopoverController, NavParams, LoadingController, Events } from 'ionic-angular';
import { PopoverPage } from './../../components/popover/popover';
import { CategoryProduct } from './../../model/categoryProduct/categoryProduct';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { ToastService } from './../../providers/toast-service/toastService';
@Component({
    templateUrl: 'categoryProduct.html'
})
export class CategoryProductPage implements OnInit {
    product_id: string;
    title: string;
    limit: number = 10;
    page: number = 1;
    categoryProduct: any;
    access_token: string;
    showPopOver: boolean = false;
    error: boolean = false;
    c_Id: string;
    sortByData: any;
    filterData: Array<any> = [];
    previouseSortSection: string;
    previouseSortOrder: string;
    infinite: any;
    enableInfinite: boolean = true;
    doRefreshCheck = true;
    constructor( private _toast: ToastService,private _appConfigService: AppDataConfigService, private _events: Events, private _local: Storage, private _category: CategoryProduct, private _loadingCtrl: LoadingController, private _navCtrl: NavController, private _navParams: NavParams, private _menuCtrl: MenuController, private _popoverCtrl: PopoverController) {
        this.product_id = _navParams.get('id');
        this.title = _navParams.get('name');
        this.c_Id = _navParams.get('name');
        _menuCtrl.enable(true);
    }
    ngOnInit() {
        this._events.subscribe('sort:data', (data) => {
            this.enableInfinite = false;
            this.sortByData = data.data;
            this.page = 1;
            this.categoryProduct = null;
            this.previouseSortSection = data.data.sortBy;
            this.previouseSortOrder = data.data.sort_order;
            this.show_products(this.page, this.limit, this.product_id, this.sortByData, this.filterData);
            if (this.infinite) {
                this.doInfinite(this.infinite, true);
            }
        });
        this._events.subscribe('filter:data', (filterData) => {
            this.filterData = filterData;
            this.enableInfinite = false;
            this.categoryProduct = null;
            this.page = 1;
            this.show_products(this.page, this.limit, this.product_id, this.sortByData, this.filterData);
            if (this.infinite) {
                this.doInfinite(this.infinite, true);
            }
        });
        this.access_token = this._navParams.get("access_token");
        this._appConfigService.getUserData().then((userData: any) => {
            if (this.access_token != null || userData != null) {
                this.showPopOver = true;
            } else {
                this.showPopOver = false;
            }
        });
        this.show_products(this.page, this.limit, this.product_id, this.sortByData, this.filterData);
    }
    ngOnDestroy() {
        this._events.unsubscribe('sort:data');
        this._events.unsubscribe('filter:data');
    }
    show_products(page: any, limit: any, product_id, sortByData?, filterData?) {
        return new Promise((resolve, reject) => {
            let body;
            if (!sortByData) {
                body = { "id": product_id, "page": page, "limit": limit, "sort_by": "position", "sort_order": "asc", "filter": filterData };
            } else {
                body = { "id": sortByData.product_id, "page": page, "limit": limit, "sort_by": sortByData.sortBy, "sort_order": sortByData.sort_order, "filter": filterData };
            }
            this._category.getCategoryProduct(body, this.doRefreshCheck).then((res) => {
                this.categoryProduct = res;
                resolve(this.categoryProduct);
            },(err) => {
                this.error = true
                this._toast.toast("Please Try Again", 3000, "top");
                          });
        })
    }
    doInfinite(infiniteScroll, check?) {
        this.infinite = infiniteScroll;
        if (check) {
            infiniteScroll.complete();
            infiniteScroll.enable(true);
            return;
        }
        if (this.enableInfinite) {
            ++this.page;
            let body;
            if (!this.sortByData) {
                body = { "id": this.product_id, "page": this.page, "limit": this.limit, "sort_by": "position", "sort_order": "asc", "filter": this.filterData };
            } else {
                body = { "id": this.sortByData.product_id, "page": this.page, "limit": this.limit, "sort_by": this.sortByData.sortBy, "sort_order": this.sortByData.sort_order, "filter": this.filterData };
            }
            this._category.getCategoryProduct(body).then((res) => {
                this.categoryProduct.body = this.categoryProduct.body.concat(res.body);
                infiniteScroll.complete();
                if (res.body.length < 10) {
                    infiniteScroll.complete();
                }
            },(err) => {
                infiniteScroll.complete();
                infiniteScroll.enable(false);
                this._toast.toast("Please Try Again", 3000, "top");         

            });
        } else {
            infiniteScroll.complete();
            infiniteScroll.enable(true);
            this.enableInfinite = true
        }
    }
    spinner(categoryProduct) {
        if (categoryProduct && Object.keys(categoryProduct).length > 0) {
            return false;
        } else {
            return true;
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
        this.page = 1;
        this.enableInfinite = false;
        this.categoryProduct = null;
        this.doRefreshCheck = false;
        this._appConfigService.resetDataInService();
        this.show_products(this.page, this.limit, this.product_id, this.sortByData, this.filterData).then((res) => {
            if (res) {
                refresher.complete();
            }
        })

    }
    gotoLogin() {
        this._navCtrl.push(LoginPage);
    }
}
