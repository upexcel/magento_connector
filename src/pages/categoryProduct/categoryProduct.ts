import {Component, OnInit} from '@angular/core';
import {NavController, MenuController, PopoverController, NavParams, ViewController, LoadingController, Events} from 'ionic-angular';
import {PopoverPage} from './../../components/popover/popover';
import {CategoryProduct} from './../../model/categoryProduct/categoryProduct';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {LoginPage} from '../login/login';
import {Storage} from '@ionic/storage';
@Component({
    templateUrl: 'categoryProduct.html'
})
export class CategoryProductPage implements OnInit {
    products: any;
    product_id: any;
    title: string;
    limit: number = 10;
    page: number = 1;
    categoryProduct: any;
    access_token: string;
    showPopOver: boolean = false;
    error: boolean = false;
    c_Id: any;
    sortByData: any;
    filterData:any = [];
    previouseSortSection:any;
    constructor(private _viewCtrl: ViewController, private _appConfigService: AppDataConfigService, private _events: Events, private _local: Storage, private _category: CategoryProduct, private _loadingCtrl: LoadingController, private _navCtrl: NavController, private _navParams: NavParams, private _menuCtrl: MenuController, private _popoverCtrl: PopoverController) {
        this.product_id = _navParams.get('id');
        this.title = _navParams.get('name');
        this.c_Id = _navParams.get('name');
        _menuCtrl.enable(true);
    }
    ngOnInit() {
        this._events.subscribe('sort:data', (data) => {
            this.sortByData = data.data;
            this.categoryProduct = null;
            this.previouseSortSection = data.data.sortBy;
            this.page = 1;
            this.show_products(this.page, this.limit, this.product_id, this.sortByData, this.filterData);
        });
        this._events.subscribe('filter:data', (filterData) => {
            console.log('filterData',filterData)
            this.filterData = filterData;
            this.categoryProduct = null;
            this.page = 1;
            this.show_products(this.page, this.limit, this.product_id, this.sortByData, this.filterData);
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
    }
    show_products(page: any, limit: any, product_id, sortByData?, filterData?) {
        let body;
        if (!sortByData) {
            body = {"id": product_id, "page": page, "limit": limit, "filter":filterData};
        } else {
            body = {"id": sortByData.product_id, "page": page, "limit": limit, "sort_by": sortByData.sortBy, "filter":filterData};
        }

        this._category.getCategoryProduct(body).then((res) => {
            this.categoryProduct = res;
        }).catch((err) => {
            this.error = true;
        });
    }
    doInfinite(infiniteScroll) {
        ++this.page;
        let body;
        if (!this.sortByData) {
            body = {"id": this.product_id, "page": this.page, "limit": this.limit, "filter":this.filterData};
        } else {
            body = {"id": this.sortByData.product_id, "page": this.page, "limit": this.limit, "sort_by": this.sortByData.sortBy, "filter": this.filterData};
        }
        this._category.getCategoryProduct(body).then((res) => {
            this.categoryProduct.body = this.categoryProduct.body.concat(res.body);
            infiniteScroll.complete();
        }).catch((err) => {
            infiniteScroll.complete();
            infiniteScroll.enable(false);
            setTimeout(()=>{
                infiniteScroll.enable(true);
            },5000);
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
    doRefresh(refresher) {
        this.page = 1;
        this.show_products(this.page, this.limit, this.product_id, this.sortByData, this.filterData);
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
    gotoLogin() {
        this._navCtrl.push(LoginPage);
    }
}
