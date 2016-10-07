import { Component, OnInit } from '@angular/core';
import {App, PopoverController, MenuController, NavController, Content, NavParams} from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import {HomePage1} from '../home1/home1';
import { Data } from './../../components/data/data';
import {PopoverPage} from './../../components/popover/popover';
import { productpage } from '../product/product';
import {StartPage} from './../../pages/startpage/startpage';
import { Storage } from '@ionic/storage';
@Component({
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {
    lists: any;
    rootPage: any;
    public data: Data[];
    showList: boolean = false;
    clickshow: boolean = false;
    products: any;
    spin: boolean;
    img: any;
    feature_products: any;
    listCheck;
    constructor(public popoverCtrl: PopoverController,public navParams: NavParams, public local: Storage, public navCtrl: NavController, public menuCtrl: MenuController, public _formService: FormService) {
    }
    ngOnInit() {
        this.slider();
        this.home_products();
        this.local.get('lists').then((value: any) => {
            this.listCheck = value;
        });
        if (this.listCheck == null) {
            var path = { "parent_id": "1", "type": "full", "store_id": "1" }
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
            data.icon = 'ios-add-circle-outline';
        } else {
            data.showDetails = true;
            data.icon = 'ios-remove-circle-outline';
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

        });
    }
    home_products() {
        this.spin = true;
        var body = { "type": "large_data" }
        this._formService.api("home/products", body).subscribe((res) => {
            if (res) {
                this.spin = false;
                this.feature_products = JSON.parse(res.data).data;
            }

        });
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
    logout() {
        console.log("hello")
        this.local.remove('firstname');
        this.local.remove('lastname');
        this.local.remove('expiry');
        this.local.remove('access_token');
        this.local.remove('lists');
        this.navCtrl.setRoot(StartPage);
    }
}
