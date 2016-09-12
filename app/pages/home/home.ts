import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, Storage, LocalStorage, PopoverController} from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import {HomePage1} from '../home1/home1';
import { Data } from './../../components/data/data';
import {PopoverPage} from './../../components/popover/popover';
import { productpage } from '../product/product'
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
    spin:boolean;
    constructor(private navCtrl: NavController, private menuCtrl: MenuController, private popoverCtrl: PopoverController,  private _formService: FormService) {

    }
    ngOnInit() {
        this.local = new Storage(LocalStorage);
       // this.rootPage = HomePage1;

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
        console.log(gchild)
         this.spin = true;
        this.clickshow = true;
        //   this.show = false;
        var path = { "id": gchild, "page": "1", "limit": "10" };
        this._formService.api("category/products/", path).subscribe((res) => {

            if (res) {
                this.spin = false;
                //    this.success = true;               
                this.products = res.data;
                console.log(res.data);
            }
            
        })
    }
}
