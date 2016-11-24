import { Component, OnInit, Input } from '@angular/core';
import {Platform} from 'ionic-angular';
import { Events, NavController, ViewController } from 'ionic-angular';
import {HomeProductsDataType  } from './../../model/home/homeProductsDataType';
import { HomeProducts } from '../../model/home/homeProducts';
import slice from 'lodash/slice';
import {ToastService} from './../../providers/toast-service/toastService';
@Component({
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {
    homeProduct: HomeProductsDataType;
    spin: boolean = true;
    feature_products: any;
    start: number = 0;
    end: number = 4;
    backPressed: boolean = false;
    public navigator: any;
    constructor(private _toast: ToastService, private _platform: Platform, private _events: Events, private _homeProductsConfig: HomeProducts, private _navCtrl: NavController, private _viewController: ViewController) { }
    ngOnInit() {
        this.homeProducts();
        this.checkBackButton();
    }
    ionViewDidEnter() {
        setTimeout(() => { this._events.publish("title", { title: "Home", pagename: "home" }); }, 0);
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
    checkBackButton() {
        this._platform.registerBackButtonAction(() => {
            if (this._viewController.isLast() && this._viewController.isFirst()) {
                if (!this.backPressed) {
                    this.backPressed = true;
                    this._toast.toast('Press Again For Exit App', 3000);
                    setTimeout(() => this.backPressed = false, 2000);
                    return;
                } else {
                    navigator.app.exitApp()
                }
            } else {
                this._navCtrl.pop();
            }
        }, 100);
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
        this.homeProducts();
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
}