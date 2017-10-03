import {Component, Input} from '@angular/core';
import {NavController, ViewController, Events} from 'ionic-angular';
import {ModalController, NavParams} from 'ionic-angular';
import {FilterOption} from './filterOption';
import {FilterByModel} from './../../model/filterBy/filterBy';
import {Storage} from '@ionic/storage';
import forEach from 'lodash/forEach';
import {FilterService} from './../../providers/filter-service/filterService';

@Component({
    selector: 'filter',
    templateUrl: 'filter.html'
})
export class FilterBy {
    @Input() product: any;
    dualValue2: any = {};
    data: any;
    filter_title: string = "";
    checkedData: any = [];
    categoryId: any;
    res: any = [];
    price: any;
    priceData: any = {};
    constructor(public _events: Events, private _filterService: FilterService, private _navParam: NavParams, private _local: Storage, public _filter: FilterByModel, private _navCtrl: NavController, private _viewCtrl: ViewController, private _modalCtrl: ModalController) {
    }
    ngOnInit() {
        this.categoryId = this._navParam.get('catedoryId');
        this.data = this._navParam.get('data');
        this.viewWillEnter();
    }
    viewWillEnter(data?) {
        this.data = data;
        this.res=[];
        this._filter.getFilterData({"id": this.categoryId, "coll": this.data ? 1 : 0}).then((res) => {
            forEach(res, (value, key) => {
                value['title'] = value['filter_title'].replace(/_/g, " ");
                if (value.filter_title != "price") {
                    this.res.push(value);
                } else {
                    this.price = value;
                }
            })
            this._filterService.getFilterPrice().then((res: any) => {
                if (res && res.lower) {
                    this.dualValue2.lower = res.lower;
                    this.dualValue2.upper = res.upper;
                    this.priceData.upper = res.upper;
                } else {
                    if (this.price) {
                        this.dualValue2.lower = this.price.price.Min;
                        this.dualValue2.upper = this.price.price.Max;
                        this.priceData.upper = this.price.price.Max;
                        this._filterService.defaultPrice(this.dualValue2);
                        this._filterService.setFilterPrice(this.dualValue2);
                    }
                }
            });
        })
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
    /** 
    *    range
    * function use for call service  for price range.
    **/
    range() {
        if (this.dualValue2.lower == this.dualValue2.upper && this.dualValue2.lower < this.priceData.upper) {
            this.dualValue2.upper = this.dualValue2.lower + 5;
        }
        this._filterService.setFilterPrice(this.dualValue2);
    }
    /** 
    *    subOptionLength
    * function use  to check sub option length
    **/
    subOptionLength(data) {
        let count = 0;
        forEach(data[data['filter_title']], (value: any, key) => {
            count++;
        })
        return count;
    }
    /* 
    *    openModal
    * function use  for crate model for filter sub data 
    **/
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
        let modal = this._modalCtrl.create(FilterOption, {"data": {option: data, filter_title: title}});
        modal.present();
        modal.onDidDismiss(data => {
            this.viewWillEnter(data['data']);
        })
    }
    dismiss() {
        this._viewCtrl.dismiss();//distroy view
    }
    /**
     *function call when filter is apply and call filterService
     **/
    applyFilter() {
        this._filterService.setFilterPrice(this.dualValue2);
        this.checkedData.push({"price": this.dualValue2});
        this._events.publish('filter:data', {data: {"filterBy": this.checkedData}});
        this._viewCtrl.dismiss();
    }
    /**
    *function call for reset FilterData
    **/
    clearAll() {
        this.checkedData = [];
        this._filterService.resetFilterData();
    }
}