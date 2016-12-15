import { Component, Input, Output, EventEmitter } from '@angular/core';
import forEach from 'lodash/forEach';

import pull from 'lodash/pull';
@Component({
    selector: 'bundle',
    templateUrl: 'bundle.html'
})
export class BundleProduct {
    @Input() bundle: any = "";
    @Output() onChange = new EventEmitter();
    @Output() onChangeData = new EventEmitter();
    @Input() valBundle: boolean;
    bundleCheck: any = [];
    bundleRadio: any = [];
    bundleratio: any;
    bundleMulti: any = [];
    bundleSelect: any = [];
    dataBundleSelect = [];
    dataBundleMulti = [];
    dataBundleCheck = [];
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
    onChangeBundleSelect(bundleSelect) {
        let self = this;
        var total = 0;
        var testPrice;
        var select = [];
        this.dataBundleSelect = [];
        var i = 1;
        forEach(bundleSelect, function(value) {
            if (value) {
                self.dataBundleSelect.push({ "nameBundleSelect": value.selection_name, "price3": value.selection_price });
            }
        })
        this.calculateTotal();
        this.obj.select.push(bundleSelect);
        this.onClick(this.obj);

    }
    onChangeBundleMulti(bundleMulti) {
        this.dataBundleMulti = [];
        this.obj.multiselect = [];
        let self = this;
        var total = 0;
        forEach(bundleMulti, function(value, key) {

            forEach(value, function(data, key1) {
                self.dataBundleMulti.push({ "nameBundleMulti": data.selection_name, "price1": data.selection_price });
            })
        })
        this.calculateTotal();
        if (bundleMulti[0]) {
            this.obj.multiselect.push(bundleMulti);
        }
        this.onClick(this.obj);
    }
    onChangeBundleCheck(x, id) {
        this.obj.checkbox = [];
        let self = this;
        var total = 0;
        self.dataBundleCheck = [];
        forEach(self.bundleCheck, function(id, key) {
            if (id) {
                forEach(x, function(value) {
                    if (key == value.selection_id) {
                        self.dataBundleCheck.push({ "nameBundleCheck": value.selection_name, "price2": value.selection_price });

                    }
                })
            }
        });
        if (self.dataBundleCheck[0]) {
            this.obj.checkbox.push(self.dataBundleCheck);
        }
        this.onClick(this.obj);
        this.calculateTotal();
    }

    onChangeBundleRadio(e) {
        console.log(e)
        console.log(this.bundleratio)
        console.log("hello radio");
        //        console.log(this.bundleRadio)
        //        console.log(e)
        //                console.log(selection)
        //
        //        if (e) {
        //            this.ratio.push(selection)
        //        } else {
        //            this.ratio = pull(this.ratio, selection);
        //           
        //        }
        this.obj.radioButton.push(this.bundleratio);
        this.onClick(this.obj);

    }
    calculateTotal() {
        let self = this;
        var total = 0;
        forEach(this.dataBundleMulti, function(value) {
            total += (value.price1 * 1);
        });
        forEach(this.dataBundleCheck, function(value) {
            total += (value.price2 * 1);
        });
        forEach(this.dataBundleSelect, function(value) {
            total += (value.price3 * 1);
        });
        this.onChange.emit(total);

    }
}
