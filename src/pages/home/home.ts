import { Component, OnInit,Input } from '@angular/core';
import { MenuController, NavController,Events} from 'ionic-angular';
import { CategoryProductPage } from '../categoryProduct/categoryProduct';
import { ProductPage } from '../product/product';
import { Storage } from '@ionic/storage';
import slice from 'lodash/slice';
import {config} from './../../providers/config/config';
import { CategoryListDataType } from './categorylistDataType';
import { CategoryList } from '../../model/home/categoryList';
import {HomeProductsDataType  } from './../../model/home/homeProductsDataType';
import { HomeProducts } from '../../model/home/homeProducts';
import { Slider } from '../../model/home/slider';
import { SliderDataType } from './../../model/home/sliderDataType';
@Component({
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {
    data: CategoryListDataType;
    homeProduct: HomeProductsDataType;
    img: SliderDataType;
    spin: boolean = true;
    feature_products: any;
    start: number = 0;
    end: number = 4;
    constructor(private _events:Events,private _homeProductsConfig:HomeProducts,private _sliderConfig: Slider, private _categoryListConfig: CategoryList, private _local: Storage, private _navCtrl: NavController, private _menuCtrl: MenuController) { }
    mySlideOptions = config.homePageSliderOptions;
    ngOnInit() {
        this.slider();
        this.homeProducts();
        this._categoryListConfig.getCategoryList().then((res) => {
            if (res) {
                this.data = res;
            }
        });
    }
    ionViewDidEnter() {
       setTimeout( () => {  this._events.publish("title",{title:"Home",pagename:"home"}); } , 0);
      }
    openMenu() {
        this._menuCtrl.open();
    }
    toggle(_toggleData) {
        if (_toggleData.showDetails) {
            _toggleData.showDetails = false;
            _toggleData.icon = 'ios-add-circle-outline';
        } else {
            _toggleData.showDetails = true;
            _toggleData.icon = 'ios-remove-circle-outline';
        }
    }
    gotoProduct(product) {
        this._navCtrl.push(ProductPage, {
            id: product
        });
    }
    gotoCategoryProduct(gchild_id: any, gchild_name: any) {
        this._menuCtrl.close();
        this._navCtrl.push(CategoryProductPage, { "id": gchild_id, "name": gchild_name });
    }

    slider() {
        this._sliderConfig.getSlider().then((res) => {
            if (res) {
                this.img = res;
            }
        });
    }
    homeProducts() {
        this.spin = true;
        let body = { "type": "large_data" }
         this._homeProductsConfig.getHomeProducts().then((res) => {
            if (res) {
                this.homeProduct = res;
                this.feature_products = slice(this.homeProduct.data, this.start, this.end);
                this.spin = false;
            }
        })
    }
    doInfinite(infiniteScroll) {
        if (this.homeProduct.data.length % 2 == 0) {
            if (this.homeProduct.data.length > this.end) {
                setTimeout(() => {
                    this.end += 4;
                    this.feature_products = slice(this.homeProduct.data, this.start, this.end);
                    infiniteScroll.complete();
                }, 2000);
            } else {
                infiniteScroll.complete();
            }
        }
        else {
            let check = this.homeProduct.data.length + 1;
            if (check >= this.end) {

                if (check == this.end) {
                    infiniteScroll.complete();
                }
                else {
                    setTimeout(() => {
                        this.end += 4;
                        this.feature_products = slice(this.homeProduct.data, this.start, this.end);
                        infiniteScroll.complete();
                    }, 2000);
                }
            }
            else {
                infiniteScroll.complete();
            }
        }

    }
    doRefresh(refresher) {
        this.slider();
        this.homeProducts();
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
}
