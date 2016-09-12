import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, Storage, LocalStorage, PopoverController} from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import {HomePage1} from '../home1/home1';
import { Data } from './../../components/data/data';
import {PopoverPage} from './../../components/popover/popover';
import { productpage } from '../product/product'
//import {LoginPage} from './../../pages/login/login'
import {StartPage} from './../../pages/startpage/startpage'
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
    constructor(private navCtrl: NavController, private menuCtrl: MenuController, private popoverCtrl: PopoverController, private _formService: FormService) {

    }
    ngOnInit() {
        this.local = new Storage(LocalStorage);
        // this.rootPage = HomePage1;
        if (localStorage.getItem('lists') === null) {
            var path = { "parent_id": "1", "type": "full" }
            this._formService.api("category/categorylist/", path).subscribe((res) => {
                if (res) {
                    this.lists = res.data.children;
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
        //        pager: true
    };

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

    toggle(data: Data) {
        if (data.showDetails) {
            data.showDetails = false;
            //            data.icon = 'ios-add-circle-outline';
        } else {
            data.showDetails = true;
            //            data.icon = 'ios-remove-circle-outline';
        }
    }
     gotoproduct(product){
       this.navCtrl.push(productpage,{
           id:product
       }); 
    }
    con(gchild: any) {
        this.menuCtrl.close();
        this.spin = true;
        this.clickshow = true;
        var path = { "id": gchild, "page": "1", "limit": "10" };
        this._formService.api("category/products/", path).subscribe((res) => {

            if (res) {
                this.spin = false;              
                this.products = res.data;
            }
            
        })
    }
     logout() {
        localStorage.removeItem('firstname');
        localStorage.removeItem('lastname');
        localStorage.removeItem('expiry');
        localStorage.removeItem('access_token');
        localStorage.removeItem('lists');
        this.navCtrl.setRoot(StartPage);
    }
}
