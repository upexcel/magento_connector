import { Component } from '@angular/core';
import { NavController, MenuController, PopoverController, NavParams} from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import { Data } from './../../components/data/data';
import {PopoverPage} from './../../components/popover/popover';
import { productpage } from '../product/product';
@Component({
    templateUrl: 'home1.html'
})
export class HomePage1 {
    lists: any;
    public data: Data[];
    showList: boolean = false;
    clickshow: boolean = false;
    products: any;
    product_id: any;
    spin: boolean;
    title: any;
    constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public popoverCtrl: PopoverController, public _formService: FormService) {
        this.product_id = navParams.get('id');
        this.title = navParams.get('name');
        menuCtrl.enable(true);
        this.show_products(this.product_id);
    }
    show_products(product_id: any) {
        this.spin = true;
        this.clickshow = true;
                var path = { 'id': product_id, 'page': '1', 'limit': '10' };

        this._formService.api("category/products/", path).subscribe((res) => {
            if (res) {
                this.spin = false;
                this.products = JSON.parse(res.body).data;
            }
        });
    }
    gotoproduct(product) {
        this.navCtrl.push(productpage, {
            id: product
        });
    }
    openMenu() {
        this.menuCtrl.open();
    }
    presentPopover(myEvent: any) {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }
    doRefresh(refresher) {
        this.show_products(this.product_id);
        console.log('Begin async operation', refresher);

        setTimeout(() => {
            console.log('Async operation has ended');
            refresher.complete();
        }, 2000);
    }
}
