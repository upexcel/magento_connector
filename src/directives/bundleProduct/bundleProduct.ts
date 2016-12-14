import { Component, Input, Output, EventEmitter } from '@angular/core';
import forEach from 'lodash/forEach';

@Component({
    selector: 'bundle',
    templateUrl: 'bundle.html'
})
export class BundleProduct {
    @Input() bundle: any = "";
    @Output() onChange = new EventEmitter();
    bundleCheck: any = [];
    bundleRadio: any = [];
    bundleMulti: any = [];
    bundleSelect: any = [];
    dataBundleSelect = [];
    dataBundleMulti = [];
    dataBundleCheck = [];
    constructor() {
    }
    onClick() {
        this.onChange.emit();
    }
    onChangeBundleSelect(bundleSelect) {
        let self = this;
        var total = 0;
        var testPrice;
        this.dataBundleSelect = [];
        forEach(bundleSelect, function(value) {
            if (value) {
                self.dataBundleSelect.push({ "nameBundleSelect": value.selection_name, "price3": value.selection_price });
            }
        })
        this.calculateTotal();
    }
    onChangeBundleMulti(bundleMulti) {
        this.dataBundleMulti = [];
        let self = this;
        var total = 0;
        forEach(bundleMulti, function(value, key) {
            forEach(value, function(data, key1) {
                self.dataBundleMulti.push({ "nameBundleMulti": data.selection_name, "price1": data.selection_price });
            })
        })
        this.calculateTotal();
    }
    onChangeBundleCheck(x, id) {
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
        })
        this.calculateTotal();
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