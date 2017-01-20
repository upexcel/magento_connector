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
    radioHidden: boolean = true;
    checkHidden: boolean = true;
    ratio = [];
    Radioobj = {};
    radioPrice: any = {};
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
                self.dataBundleSelect.push({ "nameBundleSelect": value.selection_name, "price3": value.selection_price, "disable": true });
            }
        })
        this.calculateTotal();
        this.obj.select.push(bundleSelect);
        this.onClick(this.obj);
    }
    onChangeBundleMulti(bundleMulti) {
        this.dataBundleMulti = [];
        this.obj.multiselect = [];
        let dataBundleMulti: any = [];
        let dataMulti: any = [];
        let dataSubMulti: any = [];
        let self = this;
        var total = 0;
        forEach(bundleMulti, function(value, key) {
            forEach(value, function(data, key1) {
                dataBundleMulti.push({ "nameBundleMulti": data.selection_name, "price1": data.selection_price });
                dataMulti.push(data);
            })
            if (value != undefined) {
                self.dataBundleMulti.push(dataBundleMulti);
                dataSubMulti.push(dataMulti);
                dataBundleMulti = [];
                dataMulti = [];
            }
        })
        this.calculateTotal();
        if (bundleMulti[0]) {
            this.obj.multiselect=dataSubMulti;
            this.onClick(this.obj);
        }


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

    onChangeRadio(data) {
        this.Radioobj = {};
        let radio: any;
        this.radioPrice = { "nameBundleCheck": this.bundleratio.selection_name, "price3": this.bundleratio.selection_price };
        this.Radioobj[this.bundleratio.option_id] = this.bundleratio.option_type_id;
        radio = { "radio": this.bundleratio };
        this.obj.radioButton.push(this.bundleratio);
        this.onClick(this.obj);
        this.calculateTotal();
    }
    calculateTotal() {
        let self = this;
        var total: number = 0;
        forEach(this.dataBundleMulti, function(value: any) {
            forEach(value, function(data: any) {
                if (data != undefined) {
                    total += (data.price1 * 1);
                }
            });
        });
        forEach(this.dataBundleCheck, function(value: any) {
            if (value != undefined) {
                total += (value.price2 * 1);
            }
        });
        forEach(this.dataBundleSelect, function(value: any) {
            if (value != undefined) {
                total += (value.price3 * 1);
                console.log(value.disable);
            }
        });
        if (this.radioPrice.price3 != undefined) {
            total += (this.radioPrice.price3 * 1);
        }
        this.onChange.emit(total);

    }
    checkVisiblety(name) {
        if (name == "radio") {
            this.radioHidden = false;
        }
        else {
            this.checkHidden = false;
        }
    }
}
