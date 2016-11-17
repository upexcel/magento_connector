import { Component, OnInit, Input } from '@angular/core';
import { Events, NavController } from 'ionic-angular';
import {HomeProductsDataType  } from './../../model/home/homeProductsDataType';
import { HomeProducts } from '../../model/home/homeProducts';
import slice from 'lodash/slice';
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
    constructor(private _events: Events, private _homeProductsConfig: HomeProducts, private _navCtrl: NavController) { }
    ngOnInit() {
        this.homeProducts();
        this.registerBackButtonListener();
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
    registerBackButtonListener() {
        console.log(this._navCtrl.parent);
        document.addEventListener('backbutton', () => {
                if(!this._navCtrl.parent){
                    if(!this.backPressed) {
                        this.backPressed = true;
                        console.log('back')
                        setTimeout(() => this.backPressed = false, 2000)
                        return;
                    } else{
                        navigator.app.exitApp()
                    }
                }
        });
    }
}