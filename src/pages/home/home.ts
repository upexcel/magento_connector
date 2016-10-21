import { Component, OnInit } from '@angular/core';
import { PopoverController, MenuController, NavController, NavParams} from 'ionic-angular';
import {ApiService } from './../../providers/api-service/api-service';
import { CategoryProduct } from '../categoryProduct/categoryProduct';
import {PopoverPage} from './../../components/popover/popover';
import { ProductPage } from '../product/product';
import {StartPage} from './../../pages/startpage/startpage';
import { Storage } from '@ionic/storage';
import slice from 'lodash/slice';
import {config} from './../../providers/config/config';
import { CategoryListConfigDataType } from './categorylistconfigDataType';
import { CategoryListConfig } from '../../providers/homeConfig/categoryListConfig';
import {HomeProductsConfigDataType  } from './homeProductsConfigDataType';
import { HomeProductsConfig } from '../../providers/homeConfig/homeProductsConfig'
import { SliderConfig } from '../../providers/homeConfig/sliderConfig';
import { SliderConfigDataType } from './sliderConfigDataType';
@Component({
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {
    data: CategoryListConfigDataType = {
        data: {
            children: []
        }
    }
    homeProduct: HomeProductsConfigDataType = {
        data: {
            sku: "",
            media_image: "",
            name: "",
            display_price: ""
        }
    }
    img: SliderConfigDataType = {
        data: []
    }
    rootPage: any;
    spin: boolean = true;
    feature_products: any;
    start: number = 0;
    end: number = 4;
    dataArray;
    constructor(private _homeProductsConfig:HomeProductsConfig,private _sliderConfig: SliderConfig, private _categoryListConfig: CategoryListConfig, private _popoverCtrl: PopoverController, private _navParams: NavParams, private _local: Storage, private _navCtrl: NavController, private _menuCtrl: MenuController, private _apiService: ApiService) { }
    mySlideOptions = config.homePageSliderOptions;
    ngOnInit() {
        this.slider();
        this.homeProducts();
        this._categoryListConfig.getCategoryListConfig().then((res) => {
            if (res) {
                this.data = res;
            }
        });
    }

    openMenu() {
        this._menuCtrl.open();
    }
    presentPopover(myEvent) {
        let popover = this._popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent
        });
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
    con(gchild_id: any, gchild_name: any) {
        this._menuCtrl.close();
        this._navCtrl.push(CategoryProduct, { "id": gchild_id, "name": gchild_name });
    }

    slider() {
        this._sliderConfig.getSliderConfig().then((res) => {
            if (res) {
                this.img = res;
            }
        });
    }
    homeProducts() {
        this.spin = true;
        let body = { "type": "large_data" }
         this._homeProductsConfig.getHomeProductsConfig().then((res) => {
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
