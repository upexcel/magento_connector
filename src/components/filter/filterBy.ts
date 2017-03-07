import { Component, Input } from '@angular/core';
import { NavController, ViewController, Events } from 'ionic-angular';
import { ModalController, NavParams } from 'ionic-angular';
import { FilterOption } from './filterOption';
import { FilterByModel } from './../../model/filterBy/filterBy';
import { Storage } from '@ionic/storage';
import forEach from 'lodash/forEach';
import { FilterService } from './../../providers/filter-service/filterService';
@Component({
    selector: 'filter',
    templateUrl: 'filter.html'
})
export class FilterBy {
    @Input() product: any;
    dualValue2: any={};
    data: any;
    filter_title: string = "";
    checkedData: any = [];
    categoryId: any;
    res: any = [];
    price: any;
    constructor(public _events: Events, private _filterService: FilterService, private _navParam: NavParams, private _local: Storage, public _filter: FilterByModel, private _navCtrl: NavController, private _viewCtrl: ViewController, private _modalCtrl: ModalController) {

    }
    ngOnInit() {
        this.categoryId = this._navParam.get('catedoryId');
        this.data = this._navParam.get('data');
        this._local.get('store_id').then((storeId) => {
            this._filter.getFilterData({ "id": this.categoryId, "store_id": storeId, "coll": this.data ? 1 : 0 }).then((res) => {
                forEach(res, (value, key) => {
                    if (value.filter_title != "price") {
                        this.res.push(value);
                    } else {
                        this.price = value;
                    }
                })
                if (this.price) {
                    this.dualValue2.lower = this.price.price.Min;
                    this.dualValue2.upper = this.price.price.Max;
                }
            })
        });

        this.checkedData = [];
        if (this.data) {
            this._filterService.setFilterData(this.data);
        }
        this._filterService.getFilterData().then((res) => {
            forEach(res, (resData, resKey) => {
                forEach(resData.data, (value, key) => {
                    forEach(value, (checkedValue, checkedKey) => {
                        this.checkedData.push({
                            key: checkedKey,
                            value: checkedValue,
                            title: resData.title
                        })
                    })
                })
            })
        })

    }

    range() {
    }
    openModal(title) {
        var data = '';
        this.filter_title = title;
        forEach(this.res, (value: any, key) => {
            if (title == value.filter_title) {
                data = value[value.filter_title];
            }
        })
        forEach(data, (value: any, key) => {
            value.checked = false;
            forEach(this.checkedData, (checkedValue, CheckedKey) => {
                if (checkedValue.title == title) {
                    if (value.filter_name == checkedValue.value && checkedValue.key == key) {
                        value.checked = true;
                    } else {
                    }
                }
            })
        })
        let modal = this._modalCtrl.create(FilterOption, { "data": { option: data, filter_title: title } });
        modal.present();
    }
    dismiss() {
        this._viewCtrl.dismiss();
    }
    applyFilter() {
        this._events.publish('filter:data', { data: { "filterBy": this.checkedData } });
        this._viewCtrl.dismiss();
    }
    clearAll() {
        this.checkedData = [];
        this._filterService.resetFilterData();
    }
}