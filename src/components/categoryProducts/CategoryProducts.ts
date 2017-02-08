import { Component, Input } from '@angular/core';
import { ProductPage } from '../../pages/product/product';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { GenericAnalytics } from './../../providers/genericAnalytics/genericAnalytics'
@Component({
    selector: 'category-view',
    templateUrl: 'categoryProducts.html'
})
export class CategoryComponent {
    @Input() product: any;
    displayMode: any = "Portrait";
    click: boolean = false;
    constructor(public _genericAnalytic: GenericAnalytics, private _events: Events, private _navCtrl: NavController) {
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
        this._genericAnalytic.setTrackEventValue("click", "CategoryProduct", product);
        this._navCtrl.push(ProductPage, {
            id: product
        });
    }
}
