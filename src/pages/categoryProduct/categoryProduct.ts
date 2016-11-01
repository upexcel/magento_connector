import { Component, OnInit} from '@angular/core';
import { NavController, MenuController, PopoverController, NavParams, LoadingController,Events} from 'ionic-angular';
import {PopoverPage} from './../../components/popover/popover';
import { ProductPage } from '../product/product';
import { CategoryProduct } from './../../model/categoryProduct/categoryProduct';
import {CategoryProductDataType} from './../../model/categoryProduct/categoryProductData';
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
    categoryProduct: CategoryProductDataType;
    access_token:string;
    showPopOver:boolean=false;
    constructor(private _events: Events,private _local:Storage,private _category: CategoryProduct, private _loadingCtrl: LoadingController, private _navCtrl: NavController, private _navParams: NavParams, private _menuCtrl: MenuController, private _popoverCtrl: PopoverController) {
        this.product_id = _navParams.get('id');
        this.title = _navParams.get('name');
        _menuCtrl.enable(true);
    }
    ngOnInit() {
        this.access_token=this._navParams.get("access_token");
        this._local.get("access_token").then((access_token)=>{
            if(this.access_token!=null || access_token!=null){
              this.showPopOver=true;
            }else{
              this.showPopOver=false;
            }
        })
        this.presentLoading();
        this.show_products(this.product_id, this.page, this.limit);
    }
    ionViewDidEnter() {
       setTimeout( () => {  this._events.publish("title",{title:this.title}); } , 0)
    }
    show_products(product_id: any, page: any, limit: any) {
        let body = { "id": product_id, "page": page, "limit": limit };
        this._category.getCategoryProduct(body).then((res) => {
            this.categoryProduct = res;
        })
            .catch((err) => {
            });
    }
    doInfinite(infiniteScroll) {
        var limit = this.limit;
        if (this.categoryProduct.data.length % 2 == 0) {
            if (this.categoryProduct.data.length < limit) {
                infiniteScroll.complete();
            }
            else if (this.categoryProduct.data.length >= limit) {
                setTimeout(() => {
                    this.limit += 6;
                    this.show_products(this.product_id, this.page, this.limit);
                    infiniteScroll.complete();
                }, 2000);
            }
            else if (this.categoryProduct.data.length <= limit) {
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
    gotoLogin() {
        this._navCtrl.push(LoginPage);
    }
}
