import { Component, Input, Output, OnInit } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { ModalController, Platform, NavParams } from 'ionic-angular';
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
    dualValue2: any;
    data: any;
    filter_title: string = "";
    checkedData: any = [];
    res = [{ "filter_title": "color", "color": { "2": { "filter_name": "Black" }, "3": { "filter_name": "Indigo" }, "4": { "filter_name": "Pink" }, "5": { "filter_name": "Taupe" }, "6": { "filter_name": "White" } } }, { "filter_title": "occasion", "occasion": { "2": { "filter_name": "Career" }, "3": { "filter_name": "Casual" }, "4": { "filter_name": "Evening" }, "5": { "filter_name": "Taupe" }, "6": { "filter_name": "White" } } }, { "filter_title": "apparel_type", "apparel_type": { "2": { "filter_name": "Blouses" }, "3": { "filter_name": "Knits" }, "4": { "filter_name": "Tops" }, "5": { "filter_name": "Taupe" }, "6": { "filter_name": "White" } } }, { "filter_title": "sleeve_length", "sleeve_length": { "2": { "filter_name": "Long Sleeve" }, "3": { "filter_name": "Short Sleeve" }, "4": { "filter_name": "Sleeveless" }, "5": { "filter_name": "Taupe" }, "6": { "filter_name": "White" } } }, { "filter_title": "fit", "fit": { "2": { "filter_name": "Long Sleeve" }, "3": { "filter_name": "Short Sleeve" }, "4": { "filter_name": "Sleeveless" }, "5": { "filter_name": "Taupe" }, "6": { "filter_name": "White" } } }, { "filter_title": "size", "size": { "2": { "filter_name": "XS" }, "3": { "filter_name": "S" }, "4": { "filter_name": "M" }, "5": { "filter_name": "L" }, "6": { "filter_name": "XL" } } }, { "filter_title": "length", "length": { "2": { "filter_name": "XS" }, "3": { "filter_name": "S" }, "4": { "filter_name": "M" }, "5": { "filter_name": "L" }, "6": { "filter_name": "XL" } } }, { "filter_title": "gender", "gender": { "2": { "filter_name": "Female" }, "3": { "filter_name": "S" }, "4": { "filter_name": "M" }, "5": { "filter_name": "L" }, "6": { "filter_name": "XL" } } }, { "filter_title": "custom", "custom": { "2": { "filter_name": "Female" }, "3": { "filter_name": "S" }, "4": { "filter_name": "M" }, "5": { "filter_name": "L" }, "6": { "filter_name": "XL" } } }];
    constructor(private _filterService: FilterService, private _navParam: NavParams, private _local: Storage, public _filter: FilterByModel, private _navCtrl: NavController, private _viewCtrl: ViewController, private _modalCtrl: ModalController) {
        this._local.get('store_id').then((storeId) => {
            this._filter.getFilterData({ "id": "3", "store_id": storeId }).then((res) => {
            })
        })
    }
    ngOnInit() {
        this.data = this._navParam.get('data');
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
                console.log("this.checkedData", this.checkedData)
            })
        })
    }

    range() {
        console.log(this.dualValue2)
    }
    openModal(title) {
        var data = '';
        this.filter_title = title;
        forEach(this.res, (value: any, key) => {
            if (title == value.filter_title) {
                data = value[value.filter_title];
            }
        })
        let modal = this._modalCtrl.create(FilterOption, { "data": { option: data, filter_title: title } });
        modal.present();
    }
    dismiss() {
        this._viewCtrl.dismiss();
    }
    apply() { }
}