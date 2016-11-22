import { Component, Input } from '@angular/core';
import { ProductPage } from '../../pages/product/product';
import { NavController} from 'ionic-angular';
@Component({
    selector: 'category-view',
    templateUrl: 'categoryProducts.html'
})
export class CategoryComponent {
    @Input() product: any;
    constructor(private _navCtrl: NavController) {
    }
    gotoProduct(product) {
        this._navCtrl.push(ProductPage, {
            id: product
        });
    }
}
