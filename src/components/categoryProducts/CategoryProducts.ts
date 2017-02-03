import { Component, Input,Output,EventEmitter } from '@angular/core';
import { ProductPage } from '../../pages/product/product';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';
//declare var $: any;
@Component({
    selector: 'category-view',
    templateUrl: 'categoryProducts.html'
})
export class CategoryComponent {
    @Input() product: any;
    
    @Output() gotoProductEvent = new EventEmitter(); 
    displayMode: any = "Portrait";
    click: boolean = false;
    constructor(private _events: Events, private _navCtrl: NavController) {
        this._events.subscribe('view:created', (view) => {
            this.viewChange(view);
        });
    }
    viewChange(view) {
        if (view == "portrait") {
            this.displayMode = "Landscape";
        }
        else {
            this.displayMode = "Portrait";
        }
        //        else {
        //            window.addEventListener("orientationchange", (value) => {
        //                console.log("value", value);
        //                var mql = window.matchMedia("(orientation: portrait)");
        //                console.log("match medea", mql)
        //                if (mql.matches) {
        //                    // Portrait orientation
        //                    this.displayMode = "Portrait";
        //                } else {
        //                    // Landscape orientation
        //                    this.displayMode = "Landscape";
        //                }
        //                $('.scroll-content').trigger('swipe');
        //            }, false);
        //        }
    }
    gotoProduct(product) {
        this.gotoProductEvent.emit(true)
        this._navCtrl.push(ProductPage, {
            id: product
        });
    }
}
