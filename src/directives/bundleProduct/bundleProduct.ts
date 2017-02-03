import { Component, Input, Output, EventEmitter } from '@angular/core';
import forEach from 'lodash/forEach';
import merge from 'lodash/merge';


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
    validateArray: any = [];
    radioPrice: any = {};
    constructor() {
    }
    ngOnInit() {
        this.validateArray = [];
        forEach(this.bundle.bundle_items, (value, key) => {
            value.id = key;
            this.validateArray.push({ "id": value.id, "validate": true });
        })
    }
    onClick(obj) {
        let validateCount = 0;
        let custonCartDisable = true;
        forEach(this.validateArray, (value, key: any) => {
            if (value.validate == false) {
                validateCount++;
            }
        })
        if (validateCount == this.validateArray.length) {
            custonCartDisable = false;
        }
        obj = merge(obj, { "disable": custonCartDisable })
        this.onChangeData.emit(obj);
    }
    public obj = {
        multiselect: [],
        checkbox: [],
        radioButton: [],
        select: []
    }
    onChangeBundleSelect(bundleSelect, formId) {
        
        
        this.dataBundleSelect = [];
        
        forEach(bundleSelect, (value) => {
            if (value) {
                this.dataBundleSelect.push({ "nameBundleSelect": value.selection_name, "price3": value.selection_price });
                this.formValidate(formId, false);
            }
        })
        this.calculateTotal();
        this.obj.select.push(bundleSelect);
        this.onClick(this.obj);
    }
    onChangeBundleMulti(bundleMulti, formId, i) {
        this.dataBundleMulti = [];
        this.obj.multiselect = [];
        let dataBundleMulti: any = [];
        let dataMulti: any = [];
        let dataSubMulti: any = [];
        let self = this;
        if (bundleMulti[i].length > 0) {
            this.formValidate(formId, false);
        }
        else {
            this.formValidate(formId, true);
        }
        forEach(bundleMulti, (value, key) => {
            forEach(value, (data, key1) => {
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
            this.obj.multiselect = dataSubMulti;
            this.onClick(this.obj);
        }


    }
    onChangeBundleCheck(x, id, formId) {
        this.obj.checkbox = [];
        this.dataBundleCheck = [];
        var countCheck = 0;
        forEach(this.bundleCheck, (value, key) => {
            if (value) {
                if (value == true) {
                    countCheck++;
                }
                else {
                    countCheck--;
                }
            }
        })
        if (countCheck > 0) {
            this.formValidate(formId, false);
        }
        else {
            this.formValidate(formId, true);
        }
        forEach(this.bundleCheck, (id, key) => {
            if (id) {
                forEach(x, (value) => {
                    if (key == value.selection_id) {
                        this.dataBundleCheck.push({ "nameBundleCheck": value.selection_name, "price2": value.selection_price });
                    }
                })
            }
        });
        if (this.dataBundleCheck[0]) {
            this.obj.checkbox.push(this.dataBundleCheck);
        }
        this.onClick(this.obj);
        this.calculateTotal();
    }

    onChangeRadio(formId) {
        this.Radioobj = {};
        let radio: any;
        this.radioPrice = { "nameBundleCheck": this.bundleratio.selection_name, "price3": this.bundleratio.selection_price };
        this.Radioobj[this.bundleratio.option_id] = this.bundleratio.option_type_id;
        radio = { "radio": this.bundleratio };
        this.formValidate(formId, false);
        this.obj.radioButton.push(this.bundleratio);
        this.onClick(this.obj);
        this.calculateTotal();
    }
    calculateTotal() {
        
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
            }
        });
        if (this.radioPrice.price3 != undefined) {
            total += (this.radioPrice.price3 * 1);
        }
        this.onChange.emit(total);

    }
    formValidate(data, flag) {
        forEach(this.validateArray, (value, key) => {
            if (value.id == data) {
                value.validate = flag;
                return false;
            }
        })
    }
    checkVisiblety(name) {
        if (name == "radio") {
            if (this.radioHidden) {
                this.radioHidden = false;
            }
            else {
                this.radioHidden = true;
            }
        }
        else {
            if (this.checkHidden) {
                this.checkHidden = false;
            }
            else {
                this.checkHidden = true;
            }
        }
    }
}
