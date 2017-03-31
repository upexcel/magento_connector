import { Component, Input } from '@angular/core';
import { NavController, ViewController, Events } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
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
    checkData: any = [];
    data;
    constructor(public _events: Events, private _navParam: NavParams, private _nav: NavController, private _viewCtrl: ViewController) {
        this.data = this._navParam.get('data');
        let preChecked = {};
        forEach(this.data.option, (value: any, key) => {
            this.option.push({
                "key": key,
                "value": value
            })
            if (value.checked == true) {
                preChecked = {};
                preChecked[key] = value.filter_name;
                this.checkData.push(preChecked);
            }
        })
    }
    ngOnInit() {
        this._events.subscribe('user:exit', (user) => {
            this._events.unsubscribe('user:exit');
            this._viewCtrl.dismiss();
        })
    }
    onChangeCheck(value, key, event) {
        var data = {};
        data[key] = value;
        if (event) {
            this.checkData.push(data);
        }
        else {
            this.checkData.splice(findIndex(this.checkData, data), 1);
        }
    }
    done() {
        this._nav.setRoot(FilterBy, { "data": { "data": this.checkData, "title": this.data.filter_title, "return": true } });
    }
    dismiss() {
        this._viewCtrl.dismiss();
    }


}
