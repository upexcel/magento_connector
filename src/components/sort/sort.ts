import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { SortByModel } from './../../model/sortBy/sortBy';
import forEach from 'lodash/forEach';
import { Events } from 'ionic-angular';

@Component({
    selector: 'sort',
    templateUrl: 'sort.html'
})
export class SortBy {
    data: any;
    sortRes: any = [];
    product_id: any;
    slectedSort: string;
    orderBy: string;
    constructor(public _events: Events, public _sort: SortByModel, private _navParam: NavParams, private _navCtrl: NavController, private _viewCtrl: ViewController, private _modalCtrl: ModalController) {
    }
    ngOnInit() {
        this.data = this._navParam.get('data');
        this.product_id = this._navParam.get('product_id');
        if (this.data.previouseSortSection) {
            this.slectedSort = this.data.previouseSortSection;
        } else {
            this.slectedSort = 'position';
        }
        if (this.data.previouseSortOrder) {
            this.orderBy = this.data.previouseSortOrder;
        } else {
            this.orderBy = 'asc';
        }
        let data = { 'id': this.data.catedoryId, "store_id": this.data.storeId }
        this._sort.getSortData(data).then((res: any) => {
            forEach(res, (value, key) => {
                this.sortRes.push({
                    "key": key,
                    'value': value
                })
            })
        })
        this._events.subscribe('user:exit', (user) => {
            this._events.unsubscribe('user:exit');
            this._viewCtrl.dismiss();
        })
    }
    orderByChange() {
        if (this.orderBy == 'asc') {
            this.orderBy = 'desc';
        } else {
            this.orderBy = 'asc';
        }
        this._events.publish('sort:data', { data: { "sortBy": this.slectedSort, "sort_order": this.orderBy, "product_id": this.data.catedoryId } });
        this._viewCtrl.dismiss();
    }

    dismiss(slectedSort) {
        if (slectedSort == this.data.previouseSortSection) {
            this._viewCtrl.dismiss();
        } else {
            this._viewCtrl.dismiss();
            this._events.publish('sort:data', { data: { "sortBy": slectedSort, "sort_order": this.orderBy, "product_id": this.data.catedoryId } });
        }
    }

}