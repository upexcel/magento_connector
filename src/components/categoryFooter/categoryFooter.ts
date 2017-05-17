import {Component, Input} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ModalController, ViewController} from 'ionic-angular';
import {FilterBy} from '../filter/filterBy';
import {PopoverController} from 'ionic-angular';
import {SortBy} from '../sort/sort';
import {SortByModel} from './../../model/sortBy/sortBy';
import { ModelService } from './../../providers/moniterModel/moniterModel';

@Component({
    selector: 'category-footer',
    templateUrl: 'categoryFooter.html'
})
export class CategoryFooter {
    @Input() product: any;
    @Input() catedoryId: any;
    @Input() previouseSortSection: any;
    @Input() previouseSortOrder: any;
    storeId: number;
    constructor(private _model: ModelService,public _sort: SortByModel, public _popoverCtrl: PopoverController, public _modalCtrl: ModalController, private _navCtrl: NavController, public _viewCtrl: ViewController) {
        setTimeout(() => {
            this._sort.getSortData({id: this.catedoryId}).then((res) => {});
        }, 500);
    }

    sortModel() {
        let popover = this._popoverCtrl.create(SortBy, {data: {"catedoryId": this.catedoryId, "storeId": this.storeId, "previouseSortSection": this.previouseSortSection, "previouseSortOrder": this.previouseSortOrder}});
        popover.present();
    }
    filterModal() {
        let modal = this._modalCtrl.create(FilterBy, {"catedoryId": this.catedoryId});
        modal.present();
    }
    dismiss() {
        this._viewCtrl.dismiss();
    }

}
