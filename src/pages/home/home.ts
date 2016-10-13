import { Component, OnInit } from '@angular/core';
import {App, PopoverController, MenuController, NavController, Content, NavParams} from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import {HomePage1} from '../home1/home1';
import { Data } from './../../components/data/data';
import {PopoverPage} from './../../components/popover/popover';
import { productpage } from '../product/product';
import {StartPage} from './../../pages/startpage/startpage';
import { Storage } from '@ionic/storage';
import  _ from 'lodash';
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
    start: any = 0;
    end: any = 4;
    dataArray: any;
    store_id: any;
    listCheck;
    constructor(public popoverCtrl: PopoverController,public navParams: NavParams, public local: Storage, public navCtrl: NavController, public menuCtrl: MenuController, public _formService: FormService) {
            console.clear();
    }
    ngOnInit() {
        this.local.get('store_id').then((value: any) => {
            this.store_id = value;
            console.log(value);
        this.slider();
        this.home_products();
        this.local.get('lists').then((value: any) => {
            this.listCheck = value;
        if (this.listCheck == null) {
            var path = { "parent_id": "1", "type": "full", "store_id": this.store_id  }
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
        });        });
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
        var data = [];
        var body = { "type": "large_data" }
        this._formService.api("home/products", body).subscribe((res) => {
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
                //                console.log("if1")
                setTimeout(() => {
                    this.end += 4;
                    //                    console.log(this.end);
                    this.feature_products = _.slice(this.dataArray, this.start, this.end);
                    infiniteScroll.complete();
                }, 2000);
            } else {
                infiniteScroll.complete();
            }
        }
        else {
            var check = this.dataArray.length + 1;
            if (check >= this.end) {

                if (check == this.end) {
                    infiniteScroll.complete();
                }
                else {
                    setTimeout(() => {
                        this.end += 4;
                        //                        console.log("esle" + this.end);
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
        console.log("hello")
        this.local.remove('firstname');
        this.local.remove('lastname');
        this.local.remove('expiry');
        this.local.remove('access_token');
        this.local.remove('lists');
        this.navCtrl.setRoot(StartPage);
    }
}
