import { Component, Input, Output, EventEmitter } from '@angular/core';
import forEach from 'lodash/forEach';

@Component({
    selector: 'bundal',
    templateUrl: 'bundal.html'
})
export class BundalProduct {
    @Input() bundal: any = "";
    @Output() onChange = new EventEmitter();
    bundalCheck: any = [];
    bundalRadio: any = [];
    bundalMulti: any = [];
    bundalSelect: any = [];
    dataBundalSelect = [];
    dataBundalMulti = [];
    dataBundalCheck = [];
    constructor() {
    }
    onClick() {
        this.onChange.emit();
    }
    onChangeBundalSelect(bundalSelect) {
        let self = this;
        var total = 0;
        var testPrice;
        this.dataBundalSelect = [];
        forEach(bundalSelect, function(value) {
            if (value) {
                self.dataBundalSelect.push({ "nameBundalSelect": value.selection_name, "price3": value.selection_price });
            }
        })
        this.calculateTotal();
    }
    onChangeBundalMulti(bundalMulti) {
        this.dataBundalMulti = [];
        let self = this;
        var total = 0;
        forEach(bundalMulti, function(value, key) {
            forEach(value, function(data, key1) {
                self.dataBundalMulti.push({ "nameBundalMulti": data.selection_name, "price1": data.selection_price });
            })
        })
        this.calculateTotal();
    }
    onChangeBundalCheck(x, id) {
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
        })
        this.calculateTotal();
    }
    calculateTotal() {
        let self = this;
        var total = 0;
        forEach(this.dataBundalMulti, function(value) {
            total += (value.price1 * 1);
        });
        forEach(this.dataBundalCheck, function(value) {
            total += (value.price2 * 1);
        });
        forEach(this.dataBundalSelect, function(value) {
            total += (value.price3 * 1);
        });
        this.onChange.emit(total);
        
    }
}