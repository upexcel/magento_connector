import { Component, OnInit } from '@angular/core';
import { NavController, Storage, LocalStorage, MenuController, PopoverController, NavParams} from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import { Data } from './../../components/data/data';
import {PopoverPage} from './../../components/popover/popover';
import { productpage } from '../product/product'
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
    constructor(private navCtrl: NavController, private navParams: NavParams, private menuCtrl: MenuController, private popoverCtrl: PopoverController, private _formService: FormService) {
        this.local = new Storage(LocalStorage);
        this.product_id = navParams.get('id');
        this.title = navParams.get('name');
        menuCtrl.enable(true)
    }
    ngOnInit() {
        this.show_products(this.product_id);
    }
    show_products(product_id: any) {
        this.spin = true;
        this.clickshow = true;
        var path = { "id": product_id, "page": "1", "limit": "10" };
        this._formService.api("category/products/", path).subscribe((res) => {
            if (res) {
                this.spin = false;
                this.products = res.data;
            }

        })
    }
    gotoproduct(product) {
        this.navCtrl.push(productpage, {
            id: product
        });
    }
    //    mySlideOptions = {
    //        autoplay: 3000,
    //        initialSlide: 1,
    //        loop: true,
    //        pager: true
    //    };
    openMenu() {
        console.log("nav");
        this.menuCtrl.open();
    }
    //    presentPopover(myEvent: any) {
    //        let popover = this.popoverCtrl.create(PopoverPage);
    //        popover.present({
    //            ev: myEvent,
    //        });
    //    }
}
