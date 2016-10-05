import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, Storage, LocalStorage, PopoverController} from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import {HomePage1} from '../home1/home1';
import { Data } from './../../components/data/data';
import {PopoverPage} from './../../components/popover/popover';
import { productpage } from '../product/product'
//import {LoginPage} from './../../pages/login/login'
import {StartPage} from './../../pages/startpage/startpage'
import * as _ from 'lodash'
@Component({
    templateUrl: 'build/pages/home/home.html',
    providers: [FormService],
    directives: []
})
export class HomePage implements OnInit {
    lists: any;
    rootPage: any;
    public data: Data[];
    local: any;
    showList: boolean = false;
    clickshow: boolean = false;
    products: any;
    spin: boolean;
    img: any;
    feature_products: any;
    constructor(private navCtrl: NavController, private menuCtrl: MenuController, private popoverCtrl: PopoverController, private _formService: FormService) {
               
    }
    ngOnInit() {
        this.local = new Storage(LocalStorage);
        this.slider();
        this.home_products();
        //  this.rootPage = HomePage1;
        if (localStorage.getItem('lists') === null) {
            var path = { "parent_id": "1", "type": "full","store_id":"1" }
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

                })
        } else {
            this.lists = JSON.parse(localStorage.getItem('lists'));
        }

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
    presentPopover(myEvent: any) {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
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
    gotoproduct(product) {
        this.navCtrl.push(productpage, {
            id: product
        });
    }
    con(gchild_id: any, gchild_name: any) {
        this.menuCtrl.close();
        this.navCtrl.push(HomePage1, { "id": gchild_id, "name": gchild_name });
    }

    slider() {
        let body: any;
        this._formService.api("home/slider", body).subscribe((res) => {
            if (res) {
                this.img = JSON.parse(res.body.body).data;
            }

        })
    }
    home_products() {
        this.spin = true;
        var body = { "type": "large_data" }
        this._formService.api("home/products", body).subscribe((res) => {
            if (res) {
                this.feature_products = JSON.parse(res.data).data;
                this.spin = false;
            }

        })
    }
    doRefresh(refresher) {
        this.slider();
        this.home_products();
        console.log('Begin async operation', refresher);

        setTimeout(() => {
            console.log('Async operation has ended');
            refresher.complete();
        }, 2000);
    }
}
