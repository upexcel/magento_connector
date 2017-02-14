import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';
import { FilterBy } from '../filter/filterBy';
import { PopoverController } from 'ionic-angular';
import { SortBy } from '../sort/sort';
@Component({
    selector: 'category-footer',
    templateUrl: 'categoryFooter.html'
})
export class CategoryFooter {
    @Input() product: any;
    @Input() catedoryId: any;
    constructor(public _popoverCtrl: PopoverController, public _modalCtrl: ModalController, private _navCtrl: NavController, public _viewCtrl: ViewController) {
    }

    sortModel() {
        let popover = this._popoverCtrl.create(SortBy);
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
