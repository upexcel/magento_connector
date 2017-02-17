import { Component, Input, Output, EventEmitter } from '@angular/core';
import forEach from 'lodash/forEach';
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
    bundleMulti: any;
    dataBundleMulti: any = [];
    bundleSelected: any = {}
    bundleMultiSelected: any = {};
    checkObj: any = {};
    validateArray: any = [];
    radioChecked: any = {};
    total = 0;
    constructor() {
    }
    ngOnInit() {
        this.validateArray = [];
        let m_Flag = 0;
        let c_Flag = 0;
        let r_Flag = 0;
        let s_Flag = 0;
        forEach(this.bundle.bundle_items, (value, key) => {
            value.id = key;
            value.vertualId = false;
            value.visable = true;
            value.vertualArray = [];
            if (value.is_require == "1") {
                this.validateArray.push({ "id": value.id, "validate": true });
            } else {
                this.validateArray.push({ "id": value.id, "validate": false });
            }
            forEach(value.selection, (selection: any, selectionKey) => {
                selection.defaultSet = true;
                if (selection.defaultSet == true) {
                    m_Flag = 1;
                    value.vertualId = selection;
                    if (value.type == "multi") {
                        value.vertualArray.push(selection);
                        if (!this.bundleMultiSelected[selection.selection_id]) {
                            this.bundleMultiSelected[selection.selection_id] = [];
                        }
                        this.bundleMultiSelected[selection.selection_id].push(selection.selection_product_id);
                    }
                    if (value.type == 'checkbox') {
                        if (!this.checkObj[selection.selection_id]) {
                            this.checkObj[selection.selection_id] = [];
                        }
                        this.checkObj[selection.selection_id].push(selection.selection_product_id);
                    }
                    if (value.type == 'radio' && value.vertualId) {
                        this.radioChecked[value.vertualId.selection_id] = value.vertualId.selection_product_id;
                    }
                    if (value.type == 'select' && value.vertualId) {
                        this.bundleSelected[value.vertualId.selection_id] = value.vertualId.selection_product_id;
                    }
                }
            })
            if (m_Flag == 1) {
                this.formValidate(value.id, false, value.is_require);
                m_Flag = 0;
            }
            if (c_Flag == 1) {
                this.formValidate(value.id, false, value.is_require);
                c_Flag = 0;
            }
            if (s_Flag == 1) {
                this.formValidate(value.id, false, value.is_require);
                s_Flag = 0;
            }
            if (r_Flag == 1) {
                this.formValidate(value.id, false, value.is_require);
                r_Flag = 0;
            }
        })
    }

    onChangeBundleSelect(bundleSelect, formId, is_require) {
        this.bundleSelected = {};
        forEach(this.bundle.bundle_items, (value) => {
            if (value.type == 'select' && value.vertualId) {
                this.bundleSelected[value.vertualId.selection_id] = value.vertualId.selection_product_id;
            }
        });
        this.formValidate(formId, false, is_require);
        console.log("bundleSelected", this.bundleSelected)
    }
    onChangeBundleMulti(bundleMulti, formId, i, is_require) {
        this.bundleMultiSelected = {};
        forEach(this.bundle.bundle_items, (value) => {
            if (value.type == 'multi') {
                forEach(value.vertualArray, (multiSelectData) => {
                    if (!this.bundleMultiSelected[multiSelectData.selection_id]) {
                        this.bundleMultiSelected[multiSelectData.selection_id] = [];
                    }
                    this.bundleMultiSelected[multiSelectData.selection_id].push(multiSelectData.selection_product_id);
                });
            }
        });
        console.log(this.bundleMultiSelected);
        if (bundleMulti.length > 0) {
            this.formValidate(formId, false, is_require);
        }
        else {
            this.formValidate(formId, true, is_require);
        }
    }
    onChangeBundleCheck(selection, formId, is_require) {
        this.checkObj = {};
        var countCheck = 0;
        forEach(selection, (value, key) => {
            if (value) {
                if (value.defaultSet == true) {
                    countCheck++;
                }
            }
        })
        if (countCheck > 0) {
            this.formValidate(formId, false, is_require);
        }
        else {
            this.formValidate(formId, true, is_require);
        }
        forEach(this.bundle.bundle_items, (valueItems) => {
            if (valueItems.type == "checkbox") {
                forEach(valueItems.selection, (value) => {
                    if (value.defaultSet == true) {
                        if (!this.checkObj[value.selection_id]) {
                            this.checkObj[value.selection_id] = [];
                        }
                        this.checkObj[value.selection_id].push(value.selection_product_id);
                    }
                })
            }
        });
        console.log("this.checkObj", this.checkObj);
    }

    onChangeRadio(selection, formId, is_require) {
        this.radioChecked = {};
        forEach(this.bundle.bundle_items, (value) => {
            if (value.type == 'radio' && value.vertualId) {
                this.radioChecked[value.vertualId.selection_id] = value.vertualId.selection_product_id;
            }
        });
        this.formValidate(formId, false, is_require);
        console.log(this.radioChecked);
    }
    calculateTotal(obj) {
        let total = 0;
        forEach(this.bundle.bundle_items, (value) => {
            if ((value.type == 'radio' || value.type == 'select') && value.vertualId) {
                total += (value.vertualId.selection_price * 1);
            }
            if (value.type == "multi") {
                forEach(value.vertualArray, (multiValue1) => {
                    total += (multiValue1.selection_price * 1);
                })
            }
            if (value.type == "checkbox") {
                forEach(value.selection, (checkboxValue1) => {
                    if (checkboxValue1.defaultSet == true) {
                        total += (checkboxValue1.selection_price * 1);
                    }
                })
            }
        })
        obj["total"]=total;
        setTimeout(() => {
            this.onChangeData.emit(obj);
        }, 100);
        console.log("total", obj)
        //        this.onChange.emit(total);

    }
    formValidate(data, flag, is_require) {
        let validateCount = 0;
        let obj;
        if (is_require == "0") {
            flag = false;
        }
        forEach(this.validateArray, (value, key) => {
            if (value.id == data) {
                value.validate = flag;
                return false;
            }
        })
        forEach(this.validateArray, (value) => {
            if (value.validate == false) {
                validateCount++;
            }
        })
        if (validateCount == this.validateArray.length) {
            obj = { "disable": false };
        } else {
            obj = { "disable": true };
        }
        this.calculateTotal(obj);

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
