import {Component, OnInit} from '@angular/core';
import {NavController, MenuController, PopoverController, NavParams, LoadingController, Events} from 'ionic-angular';
import {CategoryProduct} from './../../model/categoryProduct/categoryProduct';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {Storage} from '@ionic/storage';
import {ToastService} from './../../providers/toast-service/toastService';
@Component({
    selector: 'categoryProduct',
    templateUrl: 'categoryProduct.html'
})
export class CategoryProductPage implements OnInit {
    product_id: string;
    title: string;
    limit: number = 10;
    page: number = 1;
    categoryProduct: any;
    error: boolean = false;
    sortByData: any;
    filterData: Array<any> = [];
    previouseSortSection: string;
    previouseSortOrder: string;
    infinite: any;
    enableInfinite: boolean = true;
    doRefreshCheck = true;
    display_mode: string="";
    product_count: number=0;
    constructor(private _toast: ToastService, private _appConfigService: AppDataConfigService, private _events: Events, private _local: Storage, private _category: CategoryProduct, private _loadingCtrl: LoadingController, private _navCtrl: NavController, private _navParams: NavParams, private _menuCtrl: MenuController, private _popoverCtrl: PopoverController) {
        this.product_id = _navParams.get('id'); //get product_id
        this.title = _navParams.get('name'); //get title
        this.display_mode = _navParams.get('display_mode');//get display_mode use to hide filter
        this.product_count = _navParams.get('product_count');
        this.categoryProduct = _navParams.get('relatedData');
        //          _menuCtrl.enable(true);
    }
    ngOnInit() {
        //catch event for sorting
        this._events.subscribe('sort:data', (data) => {
            this.enableInfinite = false;
            this.sortByData = data.data;
            this.page = 1;
            this.categoryProduct = null;    //clear data
            this.previouseSortSection = data.data.sortBy;
            this.previouseSortOrder = data.data.sort_order;
            this.show_products(this.page, this.limit, this.product_id, this.sortByData, this.filterData);
            if (this.infinite) {
                this.doInfinite(this.infinite, true);
            }
        });
        this._events.subscribe('filter:data', (filterData) => {  //catch event of filter  
            this.filterData = filterData;
            this.enableInfinite = false;
            this.categoryProduct = null; //clear data 
            this.page = 1;
            this.show_products(this.page, this.limit, this.product_id, this.sortByData, this.filterData);
            if (this.infinite) {
                this.doInfinite(this.infinite, true);
            }
        });
        console.log("this._navParams.get('relatedData')",this._navParams.get('relatedData'))
        if (!this._navParams.get('relatedData')) {
            this.show_products(this.page, this.limit, this.product_id, this.sortByData, this.filterData);
        }
    }
    ngOnDestroy() {
        // unsubscribe events
        this._events.unsubscribe('sort:data');
        this._events.unsubscribe('filter:data');
    }
    /**
    * show_products
    *
    * function use to visible Category Products with some optional fileds (sortByData?, filterData?)
    **/

    show_products(page: any, limit: any, product_id, sortByData?, filterData?) {
        return new Promise((resolve, reject) => {
            let body;
            if (!sortByData) {
                //default sort order asc (create data use to fire api)
                body = {"id": product_id, "page": page, "limit": limit, "sort_by": "position", "sort_order": "asc", "filter": filterData};
            } else {
                body = {"id": sortByData.product_id, "page": page, "limit": limit, "sort_by": sortByData.sortBy, "sort_order": sortByData.sort_order, "filter": filterData};
            }
            //call category/product api
            this._category.getCategoryProduct(body, this.doRefreshCheck).then((res) => {
                this.categoryProduct = res;
                resolve(this.categoryProduct);
            }, (err) => {
                this.error = true;
                this._toast.toast("Please Try Again", 3000, "top");
            });
        })
    }
    /**
    * doInfinite
    *
    * function is use to handle infinite scroll 
    **/

    doInfinite(infiniteScroll, check?) {
        this.infinite = infiniteScroll;
        if (check) {
            infiniteScroll.complete();
            infiniteScroll.enable(true);
            return;
        }
        if (this.enableInfinite) {
            //count pages
            ++this.page;
            let body;
            if (!this.sortByData) {
                //default sort order asc (create data use to fire api)
                body = {"id": this.product_id, "page": this.page, "limit": this.limit, "sort_by": "position", "sort_order": "asc", "filter": this.filterData};
            } else {
                body = {"id": this.sortByData.product_id, "page": this.page, "limit": this.limit, "sort_by": this.sortByData.sortBy, "sort_order": this.sortByData.sort_order, "filter": this.filterData};
            }
            //call category/product api
            this._category.getCategoryProduct(body).then((res) => {
                this.categoryProduct.body = this.categoryProduct.body.concat(res.body);
                infiniteScroll.complete();
                if (res.body.length < 10) {
                    infiniteScroll.complete();
                }
            }, (err) => {
                infiniteScroll.complete();
                infiniteScroll.enable(false);
                //                this._toast.toast("Please Try Again", 3000, "top");
            });
        } else {
            infiniteScroll.complete();
            infiniteScroll.enable(true);
            this.enableInfinite = true
        }
    }
    //functon use in ion-spinner to check variable is empty or not
    spinner(categoryProduct) {
        if (categoryProduct && Object.keys(categoryProduct).length > 0) {
            return false;
        } else {
            return true;
        }
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
}
