import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { SortByModel } from './../../model/sortBy/sortBy';
import forEach from 'lodash/forEach';

@Component({
    selector: 'sort',
    templateUrl: 'sort.html'
})
export class SortBy {
    data: any;
    sortRes: any = [];
    constructor(public _sort: SortByModel, private _navParam: NavParams, private _navCtrl: NavController, private _viewCtrl: ViewController, private _modalCtrl: ModalController) {
    }
    ngOnInit() {
        this.data = this._navParam.get('data');
        let data = { 'id': this.data.catedoryId, "store_id": this.data.storeId }
        this._sort.getSortData(data).then((res: any) => {
            forEach(res, (value, key) => {
                this.sortRes.push({
                    "key": key,
                    'value': value
                })
            })
            console.log(this.sortRes)
        })
    }

    dismiss() {
        this._viewCtrl.dismiss();
    }

}