import { Component, OnInit } from '@angular/core';
import {App, PopoverController, MenuController, NavController, Content, NavParams} from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import { CategoryProduct } from '../categoryProduct/categoryProduct';
import { Data } from './../../components/data/data';
import {PopoverPage} from './../../components/popover/popover';
import { ProductPage } from '../product/product';
import {StartPage} from './../../pages/startpage/startpage';
import { Storage } from '@ionic/storage';
import slice from 'lodash/slice';
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
    constructor(public popoverCtrl: PopoverController, public navParams: NavParams, public local: Storage, public navCtrl: NavController, public menuCtrl: MenuController, public _formService: FormService) {
        console.clear();
    }
    ngOnInit() {
        this.local.get('store_id').then((value: any) => {
            this.store_id = value;
            this.slider();
            this.home_products();
            this.local.get('lists').then((value: any) => {
                this.listCheck = value;
                if (this.listCheck == null) {
                    let path = { "parent_id": "1", "type": "full", "store_id": this.store_id }
                    this._formService.api("category/categorylist/", path).subscribe((res) => {
                        if (res) {
                            this.lists = JSON.parse(res.body).data.children;
                            this.local.set('lists', JSON.stringify(this.lists));
                        }
                    },
                        (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                } else {
                    this.local.get('lists').then((value: any) => {
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
        this.menuCtrl.open();
    }
    presentPopover(myEvent) {
        let popover = this.popoverCtrl.create(PopoverPage);
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
        this.navCtrl.push(ProductPage, {
            id: product
        });
    }
    con(gchild_id: any, gchild_name: any) {
        this.menuCtrl.close();
        this.navCtrl.push(CategoryProduct, { "id": gchild_id, "name": gchild_name });
    }

    slider() {
        let body: any;
        this._formService.api("home/slider", body).subscribe((res) => {
            if (res) {
                this.img = JSON.parse(res.body.body).data;
            }

        });
    }
    home_products() {
        this.spin = true;
        let data = [];
        let body = { "type": "large_data" }
        this._formService.api("home/products", body).subscribe((res) => {
            if (res) {
                this.dataArray = JSON.parse(res.data).data
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
        this.home_products();
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
    logout() {
        this.local.clear().then(() => {
            this.navCtrl.push(StartPage);
        });

    }
}
