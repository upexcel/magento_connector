import { Component, Input, Output, EventEmitter } from '@angular/core';
import forEach from 'lodash/forEach';

import pull from 'lodash/pull';
@Component({
    selector: 'bundal',
    templateUrl: 'bundal.html'
})
export class BundalProduct {
    @Input() bundal: any = "";
    @Output() onChange = new EventEmitter();
    @Output() onChangeData = new EventEmitter();
    @Input() valBundal: boolean;
    bundalCheck: any = [];
    bundalRadio: any = [];
    bundalratio: any;
    bundalMulti: any = [];
    bundalSelect: any = [];
    dataBundalSelect = [];
    dataBundalMulti = [];
    dataBundalCheck = [];
    ratio = [];

    constructor() {

    }
    onClick(obj) {
        this.onChangeData.emit(obj);
    }
    public obj = {
        multiselect: [],
        checkbox: [],
        radioButton: [],
        select: []
    }
    onChangeBundalSelect(bundalSelect) {
        console.log('hello');
        let self = this;
        var total = 0;
        var testPrice;
        var select = [];
        this.dataBundalSelect = [];
        var i = 1;
        //        forEach(bundalSelect, function(value) {
        //            if (value) {
        //                self.dataBundalSelect.push(bundalSelect);
        //            }
        //            //            select[i] = value.selection_id;
        //
        //        });

        this.obj.select.push(bundalSelect);
        this.onClick(this.obj);
        this.calculateTotal();

    }
    onChangeBundalMulti(bundalMulti) {
        this.dataBundalMulti = [];
        this.obj.multiselect = [];
        let self = this;
        var total = 0;
        console.log(bundalMulti);
        //        forEach(bundalMulti, function(value, key) {
        //            forEach(value, function(data, key1) {
        //                self.dataBundalMulti.push({ "nameBundalMulti": data.selection_name, "price1": data.selection_price });
        //            })
        //        })
        if (bundalMulti[0]) {
            this.obj.multiselect.push(bundalMulti);
        }
        console.log(this.obj);
        this.onClick(this.obj);
        this.calculateTotal();
    }
    onChangeBundalCheck(x, id) {
        console.log(x, id);
        this.obj.checkbox = [];
        let self = this;
        var total = 0;
        self.dataBundalCheck = [];
        forEach(self.bundalCheck, function(id, key) {
            if (id) {
                forEach(x, function(value) {
                    if (key == value.selection_id) {
                        self.dataBundalCheck.push({ "nameBundalCheck": value.selection_name, "price2": value.selection_price });
                    
                    }
                })
            }
        });
        if (self.dataBundalCheck[0]) {
        this.obj.checkbox.push(self.dataBundalCheck);
        }
        this.onClick(this.obj);
        this.calculateTotal();
    }
    onChangeBundalRadio(selection?, e?) {
        //        console.log(this.bundalRadio)
        //        console.log(e)
        //                console.log(selection)
        //
        //        if (e) {
        //            this.ratio.push(selection)
        //        } else {
        //            this.ratio = pull(this.ratio, selection);
        //           
        //        }
        this.obj.radioButton.push(this.bundalratio);
        this.onClick(this.obj);

    }
    calculateTotal() {
        let self = this;
        var total = 0;
        forEach(this.dataBundalMulti, function(value: any) {
            total += (value.price1 * 1);
        });
        forEach(this.dataBundalCheck, function(value: any) {
            total += (value.price2 * 1);
        });
        forEach(this.dataBundalSelect, function(value: any) {
            total += (value.price3 * 1);
        });
        this.onChange.emit(total);

    }
}
