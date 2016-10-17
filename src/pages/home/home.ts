import { Component, OnInit } from '@angular/core';
import { PopoverController, MenuController, NavController, NavParams} from 'ionic-angular';
import {ApiService } from './../../providers/api-service/api-service';
import {SideMenu} from '../side_menu/side_menu';
import { Data } from './../../components/data/data';
import {PopoverPage} from './../../components/popover/popover';
import { ProductPage } from '../product/product';
import {StartPage} from './../../pages/startpage/startpage';
import { Storage } from '@ionic/storage';
import _ from 'lodash';
@Component({
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {
    lists: any;
    rootPage: any;
    public data: Data[];
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
    constructor(private _popoverCtrl: PopoverController, private _navParams: NavParams, private _local: Storage, private _navCtrl: NavController, private _menuCtrl: MenuController, private _apiService: ApiService) { }
    ngOnInit() {
        this._local.get('store_id').then((value: any) => {
            this.store_id = value;
            this.slider();
            this.home_products();
            this._local.get('lists').then((value: any) => {
                this.listCheck = value;
                if (this.listCheck == null) {
                    let path = { "parent_id": "1", "type": "full", "store_id": this.store_id }
                    this._apiService.api("category/categorylist/", path).subscribe((res) => {
                        if (res) {
                            this.lists = JSON.parse(res.body).data.children;
                            this._local.set('lists', JSON.stringify(this.lists));
                        }
                    },
                        (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                } else {
                    this._local.get('lists').then((value: any) => {
                        this.lists = JSON.parse(value);
                    });
                }
            });
        });
    }
    mySlideOptions = {
        autoplay: 3000,
        initialSlide: 1,
        loop: true,
        pager: true
    };

    openMenu() {
        this._menuCtrl.open();
    }
    presentPopover(myEvent) {
        let popover = this._popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent
        });
    }

    toggle(data: Data) {
        if (data.showDetails) {
            data.showDetails = false;
            //            data.icon = 'ios-add-circle-outline';
        } else {
            data.showDetails = true;
            //            data.icon = 'ios-remove-circle-outline';
            data.icon = 'ios-add-circle-outline';
        }
    }
    gotoProduct(product) {
        this._navCtrl.push(ProductPage, {
            id: product
        });
    }
    con(gchild_id: any, gchild_name: any) {
        this._menuCtrl.close();
        this._navCtrl.push(SideMenu, { "id": gchild_id, "name": gchild_name });
    }

    slider() {
        let body: any;
        this._apiService.api("home/slider", body).subscribe((res) => {
            if (res) {
                this.img = JSON.parse(res.body.body).data;
            }

        });
    }
    home_products() {
        this.spin = true;
        let data = [];
        let body = { "type": "large_data" }
        this._apiService.api("home/products", body).subscribe((res) => {
            if (res) {
                this.dataArray = JSON.parse(res.data).data
                this.feature_products = _.slice(this.dataArray, this.start, this.end);
                this.spin = false;
            }
        })
    }
    doInfinite(infiniteScroll) {

        if (this.dataArray.length % 2 == 0) {
            if (this.dataArray.length > this.end) {
                setTimeout(() => {
                    this.end += 4;
                    this.feature_products = _.slice(this.dataArray, this.start, this.end);
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
                        this.feature_products = _.slice(this.dataArray, this.start, this.end);
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
        this.home_products();
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
    logout() {
        this._local.clear().then(() => {
            this._navCtrl.push(StartPage);
        });

    }
}
