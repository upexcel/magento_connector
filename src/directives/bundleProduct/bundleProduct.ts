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
    bundleratio: any = [];
    bundleMulti: any = [];
    bundleSelect: any = [];
    dataBundleSelect: any = [];
    dataBundleMulti: any = [];
    dataBundleCheck: any = [];
    bundleSelected: any = {}
    radioHidden: boolean = true;
    checkHidden: boolean = true;
    bundleMultiSelected: any = {};
    ratio = [];
    Radioobj: any = {};
    checkObj: any = {};
    validateArray: any = [];
    radioChecked: any = {};
    constructor() {
    }
    ngOnInit() {
        this.validateArray = [];
        forEach(this.bundle.bundle_items, (value, key) => {
            value.id = key;
            value.visable = true;
            if (value.is_require == "1") {
                this.validateArray.push({ "id": value.id, "validate": true });
            } else {
                this.validateArray.push({ "id": value.id, "validate": false });
            }
        })
    }
    onClick(obj) {
        let validateCount = 0;
        let custonCartDisable = true;
        forEach(this.validateArray, (value) => {
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
    onChangeBundleSelect(bundleSelect, formId, is_require) {
        this.dataBundleSelect = [];
        this.bundleSelected = {};
        console.log("bundleSelect", bundleSelect);
        forEach(bundleSelect, (value) => {
            if (value) {
                this.bundleSelected[value.selection_id] = (value.selection_product_id);
                this.dataBundleSelect.push({ "nameBundleSelect": value.selection_name, "price3": value.selection_price });
                this.formValidate(formId, false, is_require);
            }
        })
        this.calculateTotal();
        this.obj.select.push(bundleSelect);
        this.onClick(this.obj);
    }
    onChangeBundleMulti(bundleMulti, formId, i, is_require) {
        this.dataBundleMulti = [];
        this.obj.multiselect = [];
        let dataBundleMulti: any = [];
        let dataMulti: any = [];
        let dataSubMulti: any = [];
        let self = this;
        this.bundleMultiSelected = {}
        if (bundleMulti[i].length > 0) {
            this.formValidate(formId, false, is_require);
        }
        else {
            this.formValidate(formId, true, is_require);
        }
        forEach(bundleMulti, (value, key) => {
            forEach(value, (data) => {
                if (!this.bundleMultiSelected[data.selection_id]) {
                    this.bundleMultiSelected[data.selection_id] = [];
                }
                this.bundleMultiSelected[data.selection_id].push(data.selection_product_id);
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
        console.log("this.bundleMulti", this.bundleMultiSelected)
        this.calculateTotal();
        if (bundleMulti[0]) {
            this.obj.multiselect = dataSubMulti;
            this.onClick(this.obj);
        }
    }
    onChangeBundleCheck(formId, is_require) {
        this.obj.checkbox = [];
        this.dataBundleCheck = [];
        this.checkObj = {};
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
            this.formValidate(formId, false, is_require);
        }
        else {
            this.formValidate(formId, true, is_require);
        }
        forEach(this.bundleCheck, (id, key) => {
            if (id) {
                forEach(this.bundle.bundle_items, (valueItems) => {
                    if (valueItems.type = "checkbox") {
                        forEach(valueItems.selection, (value) => {
                            if (key == value.selection_product_id) {
                                if (!this.checkObj[value.selection_id]) {
                                    this.checkObj[value.selection_id] = [];
                                }
                                this.checkObj[value.selection_id].push(value.selection_product_id);
                                this.dataBundleCheck.push({ "nameBundleCheck": value.selection_name, "price2": value.selection_price });
                            }
                        })
                    }
                })
            }
        });
        console.log("this.checkObj", this.checkObj);
        if (this.dataBundleCheck[0]) {
            this.obj.checkbox.push(this.dataBundleCheck);
        }
        this.onClick(this.obj);
        this.calculateTotal();
    }

    onChangeRadio(formId, is_require) {
        this.Radioobj = {};
        let radio: any;
        this.radioChecked = {};
        this.Radioobj[this.bundleratio.option_id] = this.bundleratio.option_type_id;
        radio = { "radio": this.bundleratio };
        forEach(this.bundleratio, (value) => {
            if (value) {
                this.radioChecked[value.selection_id] = value.selection_product_id;
            }
        });
        this.formValidate(formId, false, is_require);
        console.log("this.radioChecked",this.radioChecked)
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
        forEach(this.bundleratio, (value) => {
            if (value) {
                total += (value.selection_price * 1);
            }
        })
        this.onChange.emit(total);

    }
    formValidate(data, flag, is_require) {
        if (is_require == "0") {
            flag = false;
        }
        forEach(this.validateArray, (value, key) => {
            if (value.id == data) {
                value.validate = flag;
                return false;
            }
        })
    }
    checkVisiblety(obj) {
        if (obj.visable == false) {
            obj.visable = true;
        }
        else {
            obj.visable = false;
        }
    }
}
