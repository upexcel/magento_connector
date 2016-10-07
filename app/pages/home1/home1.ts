import { Component, OnInit } from '@angular/core';
import { NavController, Storage, LocalStorage, MenuController, PopoverController, NavParams, LoadingController} from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import { Data } from './../../components/data/data';
import {PopoverPage} from './../../components/popover/popover';
import { productpage } from '../product/product'
import * as _ from 'lodash';
@Component({
    templateUrl: 'build/pages/home1/home1.html',
    providers: [FormService],
    directives: []
})
export class HomePage1 implements OnInit {
    lists: any;
    public data: Data[];
    local: any;
    showList: boolean = false;
    clickshow: boolean = false;
    products: any;
    product_id: any;
    spin: boolean;
    title: any;
    limit: number = 10;
    page: number = 1;
    pro: any;
    constructor(private navCtrl: NavController, private navParams: NavParams, public loadingCtrl: LoadingController, private menuCtrl: MenuController, private popoverCtrl: PopoverController, private _formService: FormService) {
        this.local = new Storage(LocalStorage);
        this.product_id = navParams.get('id');
        this.title = navParams.get('name');
        menuCtrl.enable(true)
    }
    ngOnInit() {
        this.presentLoading();
        this.show_products(this.product_id, this.page, this.limit);
    }
    show_products(product_id: any, page: any, limit: any) {
        //        this.spin = true;
        this.clickshow = true;
        var path = { "id": product_id, "page": page, "limit": limit };
        this._formService.api("category/products/", path).subscribe((res) => {
            var res_data = [];
            if (res) {
                this.pro = JSON.parse(res.body).data;
                for (var product of this.pro) {
                    res_data.push(product);
                }
                this.products = _.clone(res_data);
                console.log(this.products.length)
            }

        })
    }
    doInfinite(infiniteScroll) {
        var prod_length = this.products.length;
        var limit = this.limit;
        if (prod_length % 2 == 0) {
            if (prod_length < limit) {
                infiniteScroll.complete();
            }
            else if (prod_length >= limit) {
                setTimeout(() => {
                    this.limit += 6;
                    this.show_products(this.product_id, this.page, this.limit);
                    infiniteScroll.complete();
                }, 2000);
            }
            else if (prod_length <= limit) {
                setTimeout(() => {
                    this.limit += 6;
                    this.show_products(this.product_id, this.page, this.limit);
                    infiniteScroll.complete();
                }, 2000);
            }
        }
        else {
            infiniteScroll.complete();
        }
    }
    gotoproduct(product) {
        this.navCtrl.push(productpage, {
            id: product
        });
    }
    openMenu() {
        console.log("nav");
        this.menuCtrl.open();
    }
    presentPopover(myEvent: any) {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }
    presentLoading() {
        let loader = this.loadingCtrl.create({
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
}
