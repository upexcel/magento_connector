import { Component, Input } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import {  NavParams } from 'ionic-angular';
import forEach from 'lodash/forEach';
import findIndex from 'lodash/findIndex';
import { FilterBy } from './filterBy'
@Component({
    selector: 'filter-option',
    templateUrl: 'filterOption.html'
})
export class FilterOption {
    @Input() product: any;
    dualValue2: any;
    option: any = [];
    check = {};
    checkData: any = [];
    data;
    constructor(private _navParam: NavParams, private _nav: NavController, private _viewCtrl: ViewController) {
        this.data = this._navParam.get('data');
        forEach(this.data.option, (value, key) => {
            this.option.push({
                "key": key,
                "value": value
            })
        })
    }
    ngOnInit() {
    }
    onChangeCheck(value, key, event) {
        var data = {};
        data[key] = value;
//        data['title']=this.data.filter_title;
        if (event) {
            this.checkData.push(data);
        }
        else {
            this.checkData.splice(findIndex(this.checkData, data), 1);
        }
        console.log(this.checkData)
    }
    done() {
        this._nav.setRoot(FilterBy, { "data":{"data": this.checkData,"title":this.data.filter_title }});
    }
    dismiss() {
        this._viewCtrl.dismiss();
    }


}
