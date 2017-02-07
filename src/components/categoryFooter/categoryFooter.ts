import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';
import { FilterBy } from '../filter/filterBy';
import { PopoverController } from 'ionic-angular';
import { SortBy } from '../sort/sort';
import { GenericAnalytics } from './../../providers/genericAnalytics/genericAnalytics'

@Component({
    selector: 'category-footer',
    templateUrl: 'categoryFooter.html'
})
export class CategoryFooter {
    @Input() product: any;
    constructor(public _genericAnalytic: GenericAnalytics, public _popoverCtrl: PopoverController, public _modalCtrl: ModalController, private _navCtrl: NavController, public _viewCtrl: ViewController) {
    }

    sortModel() {
        this._genericAnalytic.setTrackEventValue("click","sort popup open",1)
        let popover = this._popoverCtrl.create(SortBy);
        popover.present();
    }
    filterModal() {
        this._genericAnalytic.setTrackEventValue("click","filter model open", 1)
        let modal = this._modalCtrl.create(FilterBy);
        modal.present();
    }
    dismiss() {
        this._viewCtrl.dismiss();
    }

}
