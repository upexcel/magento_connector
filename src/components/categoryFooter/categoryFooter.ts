import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';
import { FilterBy } from '../filter/filterBy';
import { PopoverController } from 'ionic-angular';
import { SortBy } from '../sort/sort';
import { SortByModel } from './../../model/sortBy/sortBy';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'category-footer',
    templateUrl: 'categoryFooter.html'
})
export class CategoryFooter {
    @Input() product: any;
    @Input() catedoryId: any;
    @Input() previouseSortSection: any;
    storeId:number;
    constructor(private _local: Storage, public _sort: SortByModel, public _popoverCtrl: PopoverController, public _modalCtrl: ModalController, private _navCtrl: NavController, public _viewCtrl: ViewController) {
           this._local.get('store_id').then((storeId) => {
               this.storeId=storeId;
            this._sort.getSortData({ id: this.catedoryId, "store_id": storeId }).then((res) => {
            })
        })
     }

    sortModel() {
        let popover = this._popoverCtrl.create(SortBy,{data:{ "catedoryId": this.catedoryId,"storeId":this.storeId, "previouseSortSection": this.previouseSortSection }});
        popover.present();
    }
    filterModal() {
        let modal = this._modalCtrl.create(FilterBy, { "catedoryId": this.catedoryId });
        modal.present();
    }
    dismiss() {
        this._viewCtrl.dismiss();
    }

}
