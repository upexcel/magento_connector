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
@Component({
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {
    data: CategoryListConfigDataType = {
        data: {
            children: ""
        }
    }
    lists: any;
    rootPage: any;
    showList: boolean = false;
    clickshow: boolean = false;
    spin: boolean = true;
    img: string;
    feature_products: any;
    start: number = 0;
    end: number = 4;
    dataArray: any;
    store_id: string;
    listCheck: string;
    constructor(private _categoryListConfig:CategoryListConfig ,private _popoverCtrl: PopoverController, private _navParams: NavParams, private _local: Storage, private _navCtrl: NavController, private _menuCtrl: MenuController, private _apiService: ApiService) { }
    mySlideOptions = config.homePageSliderOptions;
    ngOnInit() {
        this.slider();
        this.homeProducts();
        this._categoryListConfig.getCategoryListConfig().then((res) => {
            if (res) {
                this.lists = res.data.children;
                this._local.set('lists', JSON.stringify(this.lists));
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
        let body: any;
        this._apiService.api("home/slider", body).subscribe((res) => {
            if (res) {
                this.img = res.data;
            }

        });
    }
    homeProducts() {
        this.spin = true;
        let body = { "type": "large_data" }
        this._apiService.api("home/products", body).subscribe((res) => {
            if (res) {
                this.dataArray = res.data;
                this.feature_products = slice(this.dataArray, this.start, this.end);
                this.spin = false;
            }
        })
    }
    doInfinite(infiniteScroll) {
        if (this.dataArray.length % 2 == 0) {
            if (this.dataArray.length > this.end) {
                setTimeout(() => {
                    this.end += 4;
                    this.feature_products = slice(this.dataArray, this.start, this.end);
                    infiniteScroll.complete();
                }, 2000);
            } else {
                infiniteScroll.complete();
            }
        }
        else {
            let check = this.dataArray.length + 1;
            if (check >= this.end) {

                if (check == this.end) {
                    infiniteScroll.complete();
                }
                else {
                    setTimeout(() => {
                        this.end += 4;
                        this.feature_products = slice(this.dataArray, this.start, this.end);
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
